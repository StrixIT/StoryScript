import {IGame, IInterfaceTexts} from 'storyScript/Interfaces/storyScript';
import {ServiceFactory} from 'storyScript/ServiceFactory.ts';
import {Component, inject} from '@angular/core';
import {getTemplate} from '../../helpers';
import {SharedModule} from "ui/Modules/sharedModule.ts";

@Component({
    standalone: true,
    selector: 'highscores',
    imports: [SharedModule],
    template: getTemplate('highscores', await import('./highscores.component.html?raw'))
})
export class HighScoresComponent {
    constructor() {
        const objectFactory = inject(ServiceFactory);
        this.game = objectFactory.GetGame();
        this.texts = objectFactory.GetTexts();
    }

    game: IGame;
    texts: IInterfaceTexts;
}