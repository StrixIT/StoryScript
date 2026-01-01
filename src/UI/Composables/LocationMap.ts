import {useStateStore} from "ui/StateStore.ts";
import {storeToRefs} from "pinia";
import {computed, ref, watch} from "vue";
import {IMap} from "storyScript/Interfaces/maps/map.ts";

export function useLocationMap() {
    const visible: string = 'visible';
    const hidden: string = 'hidden';
    const reachable: string = 'reachable';
    const visited: string = 'visited';
    const labelClass: string = 'map-location-label';
    const imageClass: string = 'map-location-image';

    const store = useStateStore();
    const {game} = storeToRefs(store);
    const {texts} = store.services;

    const map = computed(() => game.value.currentMap);
    const location = computed(() => game.value.currentLocation);
    
    const fullScreen = ref(false);
    const firstShowFullScreen = ref(true);
    const mapDialog = ref<HTMLDialogElement>(null);
    const currentMap = ref<HTMLImageElement>(null);
    const currentFullScreenMap = ref<HTMLImageElement>(null);

    watch(() => location.value, () => {
        navigateMap(map.value, currentMap.value, false);
        
        if (fullScreen.value) {
            navigateMap(map.value, currentFullScreenMap.value, false);
        }
    });

    function toggleFullScreen() {
        fullScreen.value = !fullScreen.value;

        if (fullScreen.value) {
            mapDialog.value.showModal();
            navigateMap(map.value, currentFullScreenMap.value, firstShowFullScreen.value);
            firstShowFullScreen.value = false;
            currentFullScreenMap.value.focus();
        } else {
            mapDialog.value.close();
        }
    }

    function prepareMap(newMap: IMap, cleanup: boolean) {
        if (!newMap) {
            return;
        }

        const mapContainer = currentMap.value.parentElement;

        if (cleanup) {
            firstShowFullScreen.value = true;
            currentMap.value.onload = null;
            mapContainer.onkeydown = null;
            mapContainer.onkeyup = null;
            const labelElements = Array.prototype.slice.call(mapContainer.getElementsByClassName(labelClass));
            labelElements.forEach(l => l.remove());
            const markerElements = Array.prototype.slice.call(mapContainer.getElementsByClassName(imageClass));
            markerElements.forEach(l => l.remove());
            mapDialog.value.onkeydown = null;
            mapDialog.value.onkeyup = null;
            mapDialog.value.replaceChildren();
        }

        if (newMap.toggleFullScreen === true) {
            let fullScreenMap = getMapElement(mapDialog.value);

            if (!fullScreenMap) {
                for (const n in Object.keys(mapContainer.children)) {
                    const child = mapContainer.children[n];
                    mapDialog.value.appendChild(child.cloneNode(true));
                }

                const closeToggle = mapDialog.value.getElementsByClassName('map-full-screen-toggle')[0] as HTMLSpanElement;
                closeToggle.innerText = texts.closeFullScreenMap;
                closeToggle.onclick = () => toggleFullScreen();
            }

            currentFullScreenMap.value = getMapElement(mapDialog.value);
            initMap(currentFullScreenMap.value);
        }

        initMap(currentMap.value);

        // Call navigateMap when the map image has loaded to arrange the map in its initial state.
        currentMap.value.onload = () => navigateMap(newMap, currentMap.value, true);
    }

    function initMap(mapElement: HTMLElement) {
        if (!map) {
            return;
        }

        mapElement.onkeydown = null;
        mapElement.onkeyup = null;

        map.value.locations.forEach(l => {
            const textLabel = l.markerImage ? null : l.textLabel ?? (map.value.locationNamesAsTextMarkers ? game.value.locations[l.location as string].name : null);

            if (textLabel) {
                addElement(mapElement, l.coords, l.location as string, labelClass, 'span', textLabel);
            }

            const markerImage = l.markerImage ?? map.value.locationMarkerImage;

            if (markerImage) {
                addElement(mapElement, l.coords, l.location as string, imageClass, 'img', markerImage);
            }
        });

        if (map.value.showMarkersOnKeyPress) {
            const mapContainer = mapElement.parentElement;
            const labelElements = mapElement.parentElement.getElementsByClassName(labelClass);
            const markerElements = mapElement.parentElement.getElementsByClassName(imageClass);

            mapContainer.onkeydown = e => {
                if (e.key === map.value.showMarkersOnKeyPress) {
                    setMarkerVisibility(labelElements, markerElements, visible);
                }
            };
            mapContainer.onkeyup = e => {
                if (e.key === map.value.showMarkersOnKeyPress) {
                    setMarkerVisibility(labelElements, markerElements, hidden);
                }
            }
        }
    }

    function navigateMap(map: IMap, mapElement: HTMLElement, show: boolean) {
        const parentElement = mapElement.parentElement;
        const coordString = map.locations.find(l => l.location === location.value.id)?.coords;
        const avatar = parentElement.getElementsByClassName('avatar-image')[0] as HTMLImageElement;
        let mapMargins: { x: number, y: number };

        if (coordString) {
            const coords = getCoords(coordString);
            mapMargins = {x: getMapMargin(mapElement, coords.x, 'width'), y: getMapMargin(mapElement, coords.y, 'height')};
            mapElement.style.marginLeft = `-${mapMargins.x}px`;
            mapElement.style.marginTop = `-${mapMargins.y}px`;

            if (avatar) {
                const avatarLeft = coords.x - mapMargins.x - avatar.width / 2;
                const avatarTop = coords.y - mapMargins.y - avatar.height / 2;
                setCoordinates(avatar, avatarLeft, avatarTop);
            }
        }

        const labelElements = parentElement.getElementsByClassName(labelClass);
        const markerElements = parentElement.getElementsByClassName(imageClass);
        moveMarker(labelElements, mapMargins);
        moveMarker(markerElements, mapMargins);

        if (show) {
            showElements(avatar, labelElements, markerElements);
        }

        parentElement.focus();
    }

    function setCoordinates(element: HTMLElement, left: number, top: number) {
        element.style.top = `${top}px`;
        element.style.left = `${left}px`;
    }

    function addElement(mapElement: HTMLElement, coordsString: string, location: string, className: string, elementType: string, elementValue: string) {
        const coords = getCoords(coordsString);
        const labelElement = document.createElement("div");
        labelElement.setAttribute("class", className);
        labelElement.style.visibility = hidden;
        labelElement.setAttribute("data-top", coords.x.toString());
        labelElement.setAttribute("data-left", coords.y.toString());
        labelElement.setAttribute("data-locationid", location);
        const valueElement = document.createElement(elementType);

        if (elementType === 'span') {
            (<HTMLSpanElement>valueElement).innerText = elementValue;
        } else if (elementType === 'img') {
            (<HTMLImageElement>valueElement).src = `resources/${elementValue}`;
        }

        labelElement.appendChild(valueElement);
        mapElement.parentElement.appendChild(labelElement);
    }

    function moveMarker(markerElements: HTMLCollection, mapMargins: { x: number, y: number }) {
        if (!mapMargins) {
            return;
        }

        for (const n in Object.keys(markerElements)) {
            const markerElement = markerElements[n] as HTMLElement;
            const currentLeft = parseInt(markerElement.dataset.top) - markerElement.clientWidth / 2 - mapMargins.x;
            const currentTop = parseInt(markerElement.dataset.left) - markerElement.clientHeight / 2 - mapMargins.y;
            const locationId = markerElement.dataset.locationid;
            setCoordinates(markerElement, currentLeft, currentTop);

            const isVisited = game.value.locations.get(locationId)?.hasVisited;
            markerElement.classList.remove(visited);

            if (isVisited) {
                markerElement.classList.add(visited);
            }

            if (map.value.clickable === true) {
                const isReachable = location.value.destinations.find(d => d.target === locationId);

                markerElement.onclick = null;
                markerElement.classList.remove(reachable);

                if (isReachable) {
                    markerElement.classList.add(reachable);
                    markerElement.onclick = () => {
                        game.value.changeLocation(locationId);
                    }
                } else if (location.value.id === locationId) {
                    markerElement.classList.add(reachable);
                }
            }
        }
    }

    function showElements (avatar: HTMLElement, labelElements: HTMLCollection, markerElements: HTMLCollection) {
        setTimeout(() => {
            if (avatar) {
                avatar.style.visibility = visible;
            }

            if (!map.value.showMarkersOnKeyPress) {
                setMarkerVisibility(labelElements, markerElements, visible);
            }

        }, map.value.transitionTime ?? 1000);
    }

    function setMarkerVisibility (labelElements: HTMLCollection, markerElements: HTMLCollection, visibility: string) {
        for (const n in Object.keys(labelElements)) {
            const labelElement = labelElements[n] as HTMLElement;
            labelElement.style.visibility = visibility;
        }

        for (const n in Object.keys(markerElements)) {
            const markerElement = markerElements[n] as HTMLElement;
            markerElement.style.visibility = visibility;
        }
    }

    function getCoords(coordString: string) {
        const coords = coordString.split(',');
        const coordLeft = parseInt(coords[0]);
        const coordTop = parseInt(coords[1]);
        return {x: coordLeft, y: coordTop};
    }

    function getMapMargin(mapImage: any, coord: number, dimension: string): number {
        const mapContainer = mapImage.parentElement;
        const clientDimension = 'client' + dimension.substring(0, 1).toUpperCase() + dimension.substring(1)
        const mapDimension = mapContainer[clientDimension];
        const viewPortCenter = mapDimension / 2;
        const maxMargin = mapImage[dimension] - mapDimension;
        let mapMargin = coord > viewPortCenter ? coord - viewPortCenter : 0;
        mapMargin = mapMargin > maxMargin ? maxMargin : mapMargin;
        return mapMargin;
    }

    function getMapElement (parentElement: HTMLElement): HTMLImageElement {
        return parentElement.getElementsByClassName('map-image')[0] as HTMLImageElement;
    }
    
    return {
        map,
        currentMap,
        mapDialog,
        prepareMap,
        toggleFullScreen
    }
}