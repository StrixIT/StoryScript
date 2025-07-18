import {IGame, IInterfaceTexts, IMap} from 'storyScript/Interfaces/storyScript';
import { ServiceFactory } from 'storyScript/ServiceFactory.ts';
import { Component, inject } from '@angular/core';
import { getTemplate } from '../../helpers';
import {CommonModule} from "@angular/common";
import {SafePipe} from "../../Pipes/sanitizationPipe.ts";
import {gameEvents} from "storyScript/gameEvents.ts";
import {GameEventNames} from "storyScript/GameEventNames.ts";

const visible: string = 'visible';
const hidden: string = 'hidden';
const reachable: string = 'reachable';
const visited: string = 'visited';
const labelClass: string = 'map-location-label';
const imageClass: string = 'map-location-image';

@Component({
    standalone: true,
    selector: 'location-map',
    imports: [CommonModule, SafePipe],
    template: getTemplate('map', await import('./locationmap.component.html?raw'))
})
export class LocationMapComponent {
    constructor() {
        const objectFactory = inject(ServiceFactory);
        this.game = objectFactory.GetGame();
        this.texts = objectFactory.GetTexts();
        this.map = this.game.currentMap;
        
        gameEvents.subscribe(GameEventNames.ChangeLocation, (game) => {
            this.navigateMap(this.currentMap, game, false);
        });
        
        this.prepareMap();
    }

    private fullScreen: boolean = false;
    private firstShowFullScreen: boolean = true;
    private currentMap: HTMLImageElement;
    private currentFullScreenMap: HTMLImageElement;

    game: IGame;
    texts: IInterfaceTexts;
    map: IMap;

    toggleFullScreen = () => {
        const dialogElement = this.getDialogElement();
        this.fullScreen = !this.fullScreen;

        if (this.fullScreen) {
            dialogElement.showModal();
            this.navigateMap(this.currentFullScreenMap, this.game, this.firstShowFullScreen);
            this.firstShowFullScreen = false;
            this.currentFullScreenMap.focus();
        } else {
            dialogElement.close();
        }
    }
    
    private prepareMap = () => {
        this.map.transitionTime ??= 1000;
        this.map.clickable = this.map.clickable === true;
        this.map.toggleFullScreen = this.map.toggleFullScreen === true;
        
        setTimeout(() => {
            if (this.map.toggleFullScreen) {
                const dialogElement = this.getDialogElement();

                if (!dialogElement.getElementsByClassName('map-image')[0]) {
                    const mapContainer = this.getMapElement(this.game.UIRootElement).parentElement;

                    for (const n in Object.keys(mapContainer.children)) {
                        const child = mapContainer.children[n];
                        dialogElement.appendChild(child.cloneNode(true));
                    }

                    const closeToggle = dialogElement.getElementsByClassName('map-full-screen-toggle')[0] as HTMLSpanElement;
                    closeToggle.innerText = '<';
                    closeToggle.onclick = () => this.toggleFullScreen();
                }

                this.currentFullScreenMap = this.getMapElement(dialogElement);
                this.initMap(this.currentFullScreenMap);
            }

            this.currentMap = this.getMapElement(this.game.UIRootElement);
            this.initMap(this.currentMap);
            
            // Call navigateMap now to arrange the map in its initial state.
            this.navigateMap(this.currentMap, this.game, true);
        });
    }
    
    private initMap = (mapElement: HTMLElement) => {
        if (!this.map) {
            return;
        }
        
        mapElement.onkeydown = null;
        mapElement.onkeyup = null;
        
        if (this.map.showMarkersOnKeyPress) {
            const mapContainer = mapElement.parentElement;
            const labelElements= mapElement.parentElement.getElementsByClassName(labelClass);
            const markerElements= mapElement.parentElement.getElementsByClassName(imageClass);

            mapContainer.onkeydown = e => {
                if (e.key === this.map.showMarkersOnKeyPress) {
                    this.setMarkerVisibility(labelElements, markerElements, visible);
                }
            };
            mapContainer.onkeyup = e => {
                if (e.key === this.map.showMarkersOnKeyPress) {
                    this.setMarkerVisibility(labelElements, markerElements, hidden);
                }
            }
        }
        
        this.map.locations.forEach(l => {
            const textLabel = l.markerImage ? null : l.textLabel ?? (this.map.locationNamesAsTextMarkers ? this.game.locations[l.location as string].name : null);
            
            if (textLabel) {
                this.addElement(mapElement, l.coords, l.location as string, labelClass, 'span', textLabel);
            }
            
            const markerImage = l.markerImage ?? this.map.locationMarkerImage;
            
            if (markerImage) {
                this.addElement(mapElement, l.coords, l.location as string, imageClass, 'img', markerImage);
            }
        });
    }
        
    private navigateMap = (mapElement: HTMLElement, game: IGame, showElements: boolean)=> {
        if (!this.map) {
            return;
        }
        
        const map = game.currentMap;

        setTimeout(() => {
            const parentElement = mapElement.parentElement;
            const coordString = map.locations.find(l => l.location === game.currentLocation.id)?.coords;
            const avatar = parentElement.getElementsByClassName('avatar-image')[0] as HTMLImageElement;
            let mapMargins: { x: number, y: number };

            if (coordString) {
                const coords = this.getCoords(coordString);
                mapMargins = { x: this.getMapMargin(mapElement, coords.x, 'width'), y: this.getMapMargin(mapElement, coords.y, 'height') };
                mapElement.style.marginLeft = `-${mapMargins.x}px`;
                mapElement.style.marginTop = `-${mapMargins.y}px`;
                
                if (avatar) {
                    const avatarLeft = coords.x - mapMargins.x - avatar.width / 2;
                    const avatarTop = coords.y - mapMargins.y - avatar.height / 2;
                    this.setCoordinates(avatar, avatarLeft, avatarTop);
                }
            }

            const labelElements= parentElement.getElementsByClassName(labelClass);
            const markerElements= parentElement.getElementsByClassName(imageClass);
            this.moveMarker(labelElements, mapMargins);
            this.moveMarker(markerElements, mapMargins);
            
            if (showElements) {
                this.showElements(avatar, labelElements, markerElements);
            }
            
            // This timeout is needed to allow the UI components to render and have the avatar dimensions available.
        }, 100);
    }

    private setCoordinates = (element: HTMLElement, left: number, top: number) => {
        element.style.top = `${top}px`;
        element.style.left = `${left}px`;
    }
    
    private addElement(mapElement: HTMLElement, coordsString: string, location: string, className: string, elementType: string, elementValue: string) {
        const coords = this.getCoords(coordsString);
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
    
    private moveMarker = (markerElements: HTMLCollection, mapMargins: { x: number, y: number }) => {
        if (!mapMargins) {
            return;
        }
        
        for (const n in Object.keys(markerElements)) {
            const markerElement = markerElements[n] as HTMLElement;
            const currentLeft = parseInt(markerElement.dataset.top) - markerElement.clientWidth / 2 - mapMargins.x;
            const currentTop = parseInt(markerElement.dataset.left) - markerElement.clientHeight / 2 - mapMargins.y;
            const locationId = markerElement.dataset.locationid;
            this.setCoordinates(markerElement, currentLeft, currentTop);

            const isVisited = this.game.locations.get(locationId)?.hasVisited;
            markerElement.classList.remove(visited);

            if (isVisited) {
                markerElement.classList.add(visited);
            }
            
            if (this.map.clickable) {
                const isReachable = this.game.currentLocation.destinations.find(d => d.target === locationId);

                markerElement.onclick = null;
                markerElement.classList.remove(reachable);
                
                if (isReachable) {
                    markerElement.classList.add(reachable);
                    markerElement.onclick = () => {
                        this.game.changeLocation(locationId);
                    }
                } else if (this.game.currentLocation.id === locationId) {
                    markerElement.classList.add(reachable);
                }
            }
        }
    }
    
    private showElements = (avatar: HTMLElement, labelElements: HTMLCollection, markerElements: HTMLCollection) => {
        setTimeout(() => {
            if (avatar) {
                avatar.style.visibility = visible;
            }

            if (!this.map.showMarkersOnKeyPress) {
                this.setMarkerVisibility(labelElements, markerElements, visible);
            }
            
        }, this.map.transitionTime);
    }
    
    private setMarkerVisibility = (labelElements: HTMLCollection, markerElements: HTMLCollection, visibility: string) => {
        for (const n in Object.keys(labelElements)) {
            const labelElement = labelElements[n] as HTMLElement;
            labelElement.style.visibility = visibility;
        }

        for (const n in Object.keys(markerElements)) {
            const markerElement = markerElements[n] as HTMLElement;
            markerElement.style.visibility = visibility;
        }
    }
    
    private getCoords = (coordString: string) => {
        const coords = coordString.split(',');
        const coordLeft = parseInt(coords[0]);
        const coordTop = parseInt(coords[1]);
        return { x: coordLeft, y: coordTop };
    } 

    private getMapMargin = (mapImage: any, coord: number, dimension: string): number => {
        const mapContainer = mapImage.parentElement;
        const clientDimension = 'client' + dimension.substring(0, 1).toUpperCase() + dimension.substring(1)
        const mapDimension = mapContainer[clientDimension];
        const viewPortCenter = mapDimension / 2;
        const maxMargin = mapImage[dimension] - mapDimension;
        let mapMargin = coord > viewPortCenter ? coord - viewPortCenter : 0;
        mapMargin = mapMargin > maxMargin ? maxMargin : mapMargin;
        return mapMargin;
    }

    private getDialogElement = (): HTMLDialogElement => {
        return this.game.UIRootElement.getElementsByClassName('map-dialog')[0] as HTMLDialogElement
    }
    
    private getMapElement = (parentElement: HTMLElement): HTMLImageElement => {
        return parentElement.getElementsByClassName('map-image')[0] as HTMLImageElement;
    }
}