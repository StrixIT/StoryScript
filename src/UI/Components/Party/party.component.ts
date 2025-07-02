import {ICharacter, IGame, IInterfaceTexts, IParty} from 'storyScript/Interfaces/storyScript';
import {ServiceFactory} from 'storyScript/ServiceFactory.ts';
import {Component, inject, Input} from '@angular/core';
import {getTemplate} from '../../helpers';
import {CharacterSheetComponent} from "../CharacterSheet/charactersheet.component.ts";
import {CommonModule} from "@angular/common";
import {EquipmentComponent} from "../Equipment/equipment.component.ts";
import {BackpackComponent} from "../Backpack/backpack.component.ts";
import {QuestComponent} from "../Quest/quest.component.ts";
import {FormsModule} from "@angular/forms";

@Component({
    standalone: true,
    selector: 'party',
    imports: [CommonModule, FormsModule, CharacterSheetComponent, EquipmentComponent, BackpackComponent, QuestComponent],
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