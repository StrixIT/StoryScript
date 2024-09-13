import {
    ICharacter,
    ICreateCharacter,
    ICreateCharacterStep,
    IGame,
    IInterfaceTexts
} from 'storyScript/Interfaces/storyScript';
import {CharacterService} from 'storyScript/Services/CharacterService';
import {ServiceFactory} from 'storyScript/ServiceFactory.ts';
import {Component, inject, Input} from '@angular/core';
import {getTemplate} from '../../helpers';

@Component({
    selector: 'level-up',
    template: getTemplate('levelup', await import('./levelup.component.html?raw'))
})
export class LevelUpComponent {
    @Input() character!: ICharacter;
    private _characterService: CharacterService;

    constructor() {
        this._characterService = inject(CharacterService);
        const objectFactory = inject(ServiceFactory);
        this.game = objectFactory.GetGame();
        this.texts = objectFactory.GetTexts();
    }

    sheet: ICreateCharacter;
    game: IGame;
    texts: IInterfaceTexts;

    distributionDone = (step: ICreateCharacterStep): boolean => this._characterService.distributionDone(this.sheet, step);

    levelUp = (): ICharacter => this._characterService.levelUp(this.character);
}