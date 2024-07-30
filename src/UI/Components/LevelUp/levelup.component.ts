import { IGame, IInterfaceTexts, ICreateCharacter, ICreateCharacterStep, ICharacter } from 'storyScript/Interfaces/storyScript';
import { GameService } from 'storyScript/Services/gameService';
import { CharacterService } from 'storyScript/Services/characterService';
import { ServiceFactory } from 'storyScript/ServiceFactory.ts';
import { Component, Input, inject } from '@angular/core';
import { getTemplate } from '../../helpers';

@Component({
    selector: 'level-up',
    template: getTemplate('levelup', await import('./levelup.component.html'))
})
export class LevelUpComponent {
    @Input() character!: ICharacter;
    private _gameService: GameService;
    private _characterService: CharacterService;

    constructor() {
        this._characterService = inject(CharacterService);
        this._gameService = inject(GameService);
        const objectFactory = inject(ServiceFactory);
        this.game = objectFactory.GetGame();
        this.texts = objectFactory.GetTexts();
    }

    sheet: ICreateCharacter;
    game: IGame;
    texts: IInterfaceTexts;

    distributionDone = (step: ICreateCharacterStep): boolean => this._characterService.distributionDone(this.sheet, step);

    levelUp = (): ICharacter => this._gameService.levelUp(this.character);
}