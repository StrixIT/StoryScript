import { ICharacter, IGame, IInterfaceTexts, IParty } from 'storyScript/Interfaces/storyScript';
import { ObjectFactory } from 'storyScript/ObjectFactory';
import { Component, Input, inject } from '@angular/core';
import { getTemplate } from '../../helpers';

@Component({
    selector: 'party',
    template: getTemplate('party', await import('./party.component.html'))
})
export class PartyComponent {
    @Input() party!: IParty;

    constructor() {
        const objectFactory = inject(ObjectFactory);
        this.game = objectFactory.GetGame();
        this.texts = objectFactory.GetTexts();
    }
    
    game: IGame;
    texts: IInterfaceTexts;

    setActive(character: ICharacter) {
        this.game.activeCharacter = character;
    }

}