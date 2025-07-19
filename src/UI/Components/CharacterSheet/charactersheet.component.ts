import {ICharacter, IGame, IInterfaceTexts} from 'storyScript/Interfaces/storyScript';
import {SharedMethodService} from '../../Services/SharedMethodService';
import {CharacterService} from 'storyScript/Services/CharacterService';
import {ServiceFactory} from 'storyScript/ServiceFactory.ts';
import {Component, inject, Input} from '@angular/core';
import {getTemplate} from '../../helpers';
import {NgbCollapse} from "@ng-bootstrap/ng-bootstrap";
import {FormsModule} from "@angular/forms";
import {EquipmentComponent} from "ui/Components/Equipment/equipment.component.ts";
import {BackpackComponent} from "ui/Components/Backpack/backpack.component.ts";

@Component({
    standalone: true,
    selector: 'character-sheet',
    imports: [FormsModule, NgbCollapse, EquipmentComponent, BackpackComponent],
    template: getTemplate('charactersheet', await import('./charactersheet.component.html?raw'))
})
export class CharacterSheetComponent {
    @Input() character!: ICharacter;

    constructor() {
        const characterService = inject(CharacterService);
        const sharedMethodService = inject(SharedMethodService);
        const objectFactory = inject(ServiceFactory);
        this.game = objectFactory.GetGame();
        this.texts = objectFactory.GetTexts();
        this.displayCharacterAttributes = characterService.getSheetAttributes();
        sharedMethodService.useCharacterSheet = true;
    }

    game: IGame;
    texts: IInterfaceTexts;
    displayCharacterAttributes: string[];

    limitInput = (event: any, character: ICharacter): void => {
        if (character.currentHitpoints > character.hitpoints) {
            character.currentHitpoints = character.hitpoints;
        } else if (character.currentHitpoints <= 0) {
            character.currentHitpoints = 1;
        }
    }
}