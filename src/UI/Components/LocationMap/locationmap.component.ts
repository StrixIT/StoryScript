import {IGame, IInterfaceTexts, IMap} from 'storyScript/Interfaces/storyScript';
import { ServiceFactory } from 'storyScript/ServiceFactory.ts';
import { Component, inject } from '@angular/core';
import { getTemplate } from '../../helpers';
import {CommonModule} from "@angular/common";
import {SafePipe} from "../../Pipes/sanitizationPipe.ts";
import {gameEvents} from "storyScript/gameEvents.ts";
import {GameEventNames} from "storyScript/GameEventNames.ts";

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
        gameEvents.subscribe(GameEventNames.ChangeLocation, (game, args) => {
            this.navigateMap(game);
        });
        
        setTimeout(() => this.initMap());
    }
    
    private initialTravel: boolean = true;
    private mapMarginLeft: number = 0;
    private mapMarginTop: number = 0;

    game: IGame;
    texts: IInterfaceTexts;
    map: IMap;
    
    private initMap = () => {
        this.map.transitionTime ??= 1000;
        const mapElement = this.getMapElement();
        
        this.map.locations.forEach(l => {
            const textLabel = l.textLabel ?? (this.map.locationNamesAsTextLabels ? this.game.locations[l.location as string].name : null);
            
            if (textLabel) {
                const coords = this.getCoords(l.coords);
                const labelElement = document.createElement("div");
                labelElement.setAttribute("class", "map-location-label");
                labelElement.style.visibility = "hidden";
                labelElement.setAttribute("data-top", coords.x.toString());
                labelElement.setAttribute("data-left", coords.y.toString());
                const spanElement = document.createElement("span");
                spanElement.innerText = textLabel;
                labelElement.appendChild(spanElement);
                mapElement.parentElement.appendChild(labelElement);
            }
        });
    }
        
    private navigateMap = (game: IGame)=> {
        const map = game.currentMap;
        const mapElement = this.getMapElement();

        setTimeout(() => {
            const coordString = map.locations.find(l => l.location === game.currentLocation.id)?.coords;

            if (coordString) {
                const coords = this.getCoords(coordString);
                const avatar = <any>game.UIRootElement.getElementsByClassName('avatar-image')[0];
                this.mapMarginLeft = this.getMapMargin(mapElement, coords.x, 'width');
                this.mapMarginTop = this.getMapMargin(mapElement, coords.y, 'height');
                mapElement.style.marginLeft = `-${this.mapMarginLeft}px`;
                mapElement.style.marginTop = `-${this.mapMarginTop}px`;
                
                if (avatar) {
                    const avatarLeft = coords.x - this.mapMarginLeft - avatar.width / 2;
                    const avatarTop = coords.y - this.mapMarginTop - avatar.height / 2;
                    avatar.style.left = `${avatarLeft}px`;
                    avatar.style.top = `${avatarTop}px`;
                    
                    if (this.initialTravel) {
                        setTimeout(() => {
                            avatar.style.display = 'block';
                            this.initialTravel = false;
                        }, this.map.transitionTime);
                    }
                }
            }
            
            const labelElements= mapElement.parentElement.getElementsByClassName('map-location-label');
            
            for (const n in Object.keys(labelElements)) {
                const labelElement = labelElements[n] as HTMLElement;
                const currentLeft = parseInt(labelElement.dataset.top) - labelElement.clientWidth / 2 - this.mapMarginLeft;
                const currentTop = parseInt(labelElement.dataset.left) - labelElement.clientHeight / 2 - this.mapMarginTop;
                labelElement.style.left = `${currentLeft}px`;
                labelElement.style.top = `${currentTop}px`;
            }

            if (this.initialTravel) {
                setTimeout(() => {
                    for (const n in Object.keys(labelElements)) {
                        const labelElement = labelElements[n] as HTMLElement;
                        labelElement.style.visibility = 'visible';
                    }

                    this.initialTravel = false;
                }, this.map.transitionTime);
            }
            
            // This timeout is needed to allow the UI components to render and have the avatar dimensions available.
        }, 100);
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