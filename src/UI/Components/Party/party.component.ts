import { ICharacter, IGame, IInterfaceTexts, IParty } from 'storyScript/Interfaces/storyScript';
import { ServiceFactory } from 'storyScript/ServiceFactory.ts';
import { Component, Input, inject } from '@angular/core';
import { getTemplate } from '../../helpers';

@Component({
    selector: 'party',
    template: getTemplate('party', await import('./party.component.html?raw'))
})
export class PartyComponent {
    @Input() party!: IParty;

    constructor() {
        const objectFactory = inject(ServiceFactory);
        this.game = objectFactory.GetGame();
        this.texts = objectFactory.GetTexts();
    }
    
    game: IGame;
    texts: IInterfaceTexts;

    setActive(character: ICharacter) {
        this.game.activeCharacter = character;
    }

}