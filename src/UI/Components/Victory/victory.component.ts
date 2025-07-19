import {IGame, IInterfaceTexts} from 'storyScript/Interfaces/storyScript';
import {GameService} from 'storyScript/Services/GameService';
import {ServiceFactory} from 'storyScript/ServiceFactory.ts';
import {Component, inject} from '@angular/core';
import {getTemplate} from '../../helpers';
import {HighScoresComponent} from "../HighScores/highscores.component.ts";
import {SharedModule} from "ui/Modules/sharedModule.ts";

@Component({
    standalone: true,
    selector: 'victory',
    imports: [SharedModule, HighScoresComponent],
    template: getTemplate('victory', await import('./victory.component.html?raw'))
})
export class VictoryComponent {
    private readonly _gameService: GameService;

    constructor() {
        this._gameService = inject(GameService);
        const objectFactory = inject(ServiceFactory);
        this.game = objectFactory.GetGame();
        this.texts = objectFactory.GetTexts();
    }

    game: IGame;
    texts: IInterfaceTexts;

    restart = (): void => this._gameService.restart();
}