<template>
  <div v-if="map" class="box-container map-container" tabindex="0">
    <p class="map-name">
      {{ map.name }}
      <span v-if="map.toggleFullScreen" class="map-full-screen-toggle" @click="toggleFullScreen()">></span>
    </p>
    <img class="map-image" :src="`resources/${map.mapImage}`" :alt="map.name">
    <img v-if="map.avatarImage" class="avatar-image" :src="`resources/${map.avatarImage}`" :alt="map.name" style="visibility: hidden;">
  </div>
  <dialog class="map-dialog">
  </dialog>
</template>
<script lang="ts" setup>
import {useStateStore} from "vue/StateStore.ts";
import {storeToRefs} from "pinia";
import {gameEvents} from "storyScript/gameEvents.ts";
import {GameEventNames} from "storyScript/GameEventNames.ts";
import {IGame} from "storyScript/Interfaces/game.ts";
import {IMap} from "storyScript/Interfaces/maps/map.ts";
import {computed, ref} from "vue";

const visible: string = 'visible';
const hidden: string = 'hidden';
const reachable: string = 'reachable';
const visited: string = 'visited';
const labelClass: string = 'map-location-label';
const imageClass: string = 'map-location-image';

const store = useStateStore();
const {game} = storeToRefs(store);

const { map } = defineProps<{
  map?: IMap
}>();

const getMapId = (map: IMap) => {
  return map?.['id'];
}

const currentMapId = computed(() => getMapId(map));
const fullScreen = ref(false);
const firstShowFullScreen = ref(true);
const currentMap = ref<HTMLImageElement>(null);
const currentFullScreenMap = ref<HTMLImageElement>(null);

gameEvents.subscribe(GameEventNames.ChangeLocation, (game) => {
  const map = game.currentMap;
  const currentId = getMapId(map);

  if (currentId !== currentMapId) {
    //map = map;
    //currentMapId.value = currentId;
    firstShowFullScreen.value = true;
    prepareMap(true);
  }

  navigateMap(map, currentMap.value, game, false);
});

prepareMap(false);

function toggleFullScreen() {
  const dialogElement = getDialogElement();
  fullScreen.value = !fullScreen.value;

  if (fullScreen.value) {
    dialogElement.showModal();
    navigateMap(map, currentFullScreenMap.value, game.value, firstShowFullScreen.value);
    firstShowFullScreen.value = false;
    currentFullScreenMap.value.focus();
  } else {
    dialogElement.close();
  }
}

function prepareMap(cleanup: boolean) {
  if (!map) {
    return;
  }

  setTimeout(() => {
    const mapElement = getMapElement(game.value.UIRootElement);
    const mapContainer = mapElement.parentElement;
    const dialogElement = getDialogElement();

    if (cleanup) {
      mapContainer.onkeydown = null;
      mapContainer.onkeyup = null;
      const labelElements = Array.prototype.slice.call(mapContainer.getElementsByClassName(labelClass));
      labelElements.forEach(l => l.remove());
      const markerElements = Array.prototype.slice.call(mapContainer.getElementsByClassName(imageClass));
      markerElements.forEach(l => l.remove());
      dialogElement.onkeydown = null;
      dialogElement.onkeyup = null;
      dialogElement.replaceChildren();
    }

    if (map.toggleFullScreen === true) {
      let fullScreenMap = getMapElement(dialogElement);

      if (!fullScreenMap) {
        for (const n in Object.keys(mapContainer.children)) {
          const child = mapContainer.children[n];
          dialogElement.appendChild(child.cloneNode(true));
        }

        const closeToggle = dialogElement.getElementsByClassName('map-full-screen-toggle')[0] as HTMLSpanElement;
        closeToggle.innerText = '<';
        closeToggle.onclick = () => toggleFullScreen();
      }

      currentFullScreenMap.value = getMapElement(dialogElement);
      initMap(currentFullScreenMap.value);
    }

    currentMap.value = mapElement;
    initMap(currentMap.value);

    // Call navigateMap now to arrange the map in its initial state.
    navigateMap(map, currentMap.value, game.value, true);
  });
}

function initMap(mapElement: HTMLElement) {
  if (!map) {
    return;
  }

  mapElement.onkeydown = null;
  mapElement.onkeyup = null;

  map.locations.forEach(l => {
    const textLabel = l.markerImage ? null : l.textLabel ?? (map.locationNamesAsTextMarkers ? game.value.locations[l.location as string].name : null);

    if (textLabel) {
      addElement(mapElement, l.coords, l.location as string, labelClass, 'span', textLabel);
    }

    const markerImage = l.markerImage ?? map.locationMarkerImage;

    if (markerImage) {
      addElement(mapElement, l.coords, l.location as string, imageClass, 'img', markerImage);
    }
  });

  if (map.showMarkersOnKeyPress) {
    const mapContainer = mapElement.parentElement;
    const labelElements = mapElement.parentElement.getElementsByClassName(labelClass);
    const markerElements = mapElement.parentElement.getElementsByClassName(imageClass);

    mapContainer.onkeydown = e => {
      if (e.key === map.showMarkersOnKeyPress) {
        setMarkerVisibility(labelElements, markerElements, visible);
      }
    };
    mapContainer.onkeyup = e => {
      if (e.key === map.showMarkersOnKeyPress) {
        setMarkerVisibility(labelElements, markerElements, hidden);
      }
    }
  }
}

function navigateMap(map: IMap, mapElement: HTMLElement, game: IGame, show: boolean) {
  setTimeout(() => {
    const parentElement = mapElement.parentElement;
    const coordString = map.locations.find(l => l.location === game.currentLocation.id)?.coords;
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

    // This timeout is needed to allow the UI components to render and have the avatar dimensions available.
  }, 100);
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

    if (map.clickable === true) {
      const isReachable = game.value.currentLocation.destinations.find(d => d.target === locationId);

      markerElement.onclick = null;
      markerElement.classList.remove(reachable);

      if (isReachable) {
        markerElement.classList.add(reachable);
        markerElement.onclick = () => {
          game.value.changeLocation(locationId);
        }
      } else if (game.value.currentLocation.id === locationId) {
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

    if (!map.showMarkersOnKeyPress) {
      setMarkerVisibility(labelElements, markerElements, visible);
    }

  }, map.transitionTime ?? 1000);
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

function getDialogElement(): HTMLDialogElement {
  return game.value.UIRootElement.getElementsByClassName('map-dialog')[0] as HTMLDialogElement
}

function getMapElement (parentElement: HTMLElement): HTMLImageElement {
  return parentElement.getElementsByClassName('map-image')[0] as HTMLImageElement;
}

</script>