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
        gameEvents.subscribe(GameEventNames.ChangeLocation, (game, args) => {
            this.navigateMap(game);
        });
    }
    
    private initialTravel: boolean = true;

    game: IGame;
    texts: IInterfaceTexts;
    map: IMap;

    private navigateMap = (game: IGame)=> {
        const map = game.currentMap;

        setTimeout(() => {
            const coordString = map.locations.find(l => l.location === game.currentLocation.id)?.coords;

            if (coordString) {
                const coords = coordString.split(',');
                const coordLeft = parseInt(coords[0]);
                const coordTop = parseInt(coords[1]);
                const mapImage = <any>game.UIRootElement.getElementsByClassName('map-image')[0];
                const avatar = <any>game.UIRootElement.getElementsByClassName('avatar-image')[0];
                const mapMarginLeft = this.getMapMargin(mapImage, coordLeft, 'width');
                const mapMarginTop = this.getMapMargin(mapImage, coordTop, 'height');
                mapImage.style.marginLeft = `-${mapMarginLeft}px`;
                mapImage.style.marginTop = `-${mapMarginTop}px`;
                
                if (avatar) {
                    const avatarLeft = coordLeft - mapMarginLeft - avatar.width / 2;
                    const avatarTop = coordTop - mapMarginTop - avatar.height / 2;
                    avatar.style.left = `${avatarLeft}px`;
                    avatar.style.top = `${avatarTop}px`;
                    
                    if (this.initialTravel) {
                        // Todo: get the configured timeout for the avatar here.
                        const transitionTime = 1000;
                        
                        setTimeout(() => {
                            avatar.style.display = 'block';
                        }, transitionTime);
                        this.initialTravel = false;
                    }
                }
            }
            // This timeout is needed to allow the UI components to render and have the avatar dimensions available.
        }, 100);
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
}