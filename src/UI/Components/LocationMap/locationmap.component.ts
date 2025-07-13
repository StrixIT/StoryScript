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
            this.navigateMap(game);
        });
        
        setTimeout(() => this.initMap());
    }
    
    private initialTravel: boolean = true;
    private mapMarginLeft: number = 0;
    private mapMarginTop: number = 0;
    private labelElements: HTMLCollection;
    private markerElements: HTMLCollection;

    game: IGame;
    texts: IInterfaceTexts;
    map: IMap;
    
    private initMap = () => {
        this.map.transitionTime ??= 1000;
        this.map.clickable = this.map.clickable === true;
        const mapElement = this.getMapElement();
        mapElement.onkeydown = null;
        mapElement.onkeyup = null;
        
        if (this.map.showMarkersOnKeyPress) {
            const mapContainer = mapElement.parentElement;

            mapContainer.onkeydown = e => {
                if (e.key === this.map.showMarkersOnKeyPress) {
                    this.setMarkerVisibility(this.labelElements, this.markerElements, visible);
                }
            };
            mapContainer.onkeyup = e => {
                if (e.key === this.map.showMarkersOnKeyPress) {
                    this.setMarkerVisibility(this.labelElements, this.markerElements, hidden);
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

        this.labelElements= mapElement.parentElement.getElementsByClassName(labelClass);
        this.markerElements= mapElement.parentElement.getElementsByClassName(imageClass);

        // Call navigateMap now to arrange the map in its initial state.
        this.navigateMap(this.game);
    }
        
    private navigateMap = (game: IGame)=> {
        const map = game.currentMap;
        const mapElement = this.getMapElement();

        setTimeout(() => {
            const coordString = map.locations.find(l => l.location === game.currentLocation.id)?.coords;
            const avatar = <any>game.UIRootElement.getElementsByClassName('avatar-image')[0];

            if (coordString) {
                const coords = this.getCoords(coordString);
                this.mapMarginLeft = this.getMapMargin(mapElement, coords.x, 'width');
                this.mapMarginTop = this.getMapMargin(mapElement, coords.y, 'height');
                mapElement.style.marginLeft = `-${this.mapMarginLeft}px`;
                mapElement.style.marginTop = `-${this.mapMarginTop}px`;
                
                if (avatar) {
                    const avatarLeft = coords.x - this.mapMarginLeft - avatar.width / 2;
                    const avatarTop = coords.y - this.mapMarginTop - avatar.height / 2;
                    this.setCoordinates(avatar, avatarLeft, avatarTop);
                }
            }
            
            this.moveMarker(this.labelElements);
            this.moveMarker(this.markerElements);
            this.showElementsOnStart(avatar, this.labelElements, this.markerElements);
            
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
    
    private moveMarker = (markerElements: HTMLCollection) => {
        for (const n in Object.keys(markerElements)) {
            const markerElement = markerElements[n] as HTMLElement;
            const currentLeft = parseInt(markerElement.dataset.top) - markerElement.clientWidth / 2 - this.mapMarginLeft;
            const currentTop = parseInt(markerElement.dataset.left) - markerElement.clientHeight / 2 - this.mapMarginTop;
            const locationId = markerElement.dataset.locationid;
            this.setCoordinates(markerElement, currentLeft, currentTop);

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
    
    private showElementsOnStart = (avatar: HTMLElement, labelElements: HTMLCollection, markerElements: HTMLCollection) => {
        if (this.initialTravel) {
            setTimeout(() => {
                if (avatar) {
                    avatar.style.visibility = visible;
                }

                if (!this.map.showMarkersOnKeyPress) {
                    this.setMarkerVisibility(labelElements, markerElements, visible);
                }

                this.initialTravel = false;
            }, this.map.transitionTime);
        }
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
    
    private getMapElement = (): HTMLElement => {
        return this.game.UIRootElement.getElementsByClassName('map-image')[0] as HTMLElement;
    }
}