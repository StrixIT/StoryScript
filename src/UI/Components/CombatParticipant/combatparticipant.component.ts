import {Component, inject, Input} from "@angular/core";
import {getTemplate} from "../../helpers.ts";
import {ServiceFactory} from "storyScript/ServiceFactory.ts";
import {ICharacter} from "storyScript/Interfaces/character.ts";
import {IEnemy} from "storyScript/Interfaces/enemy.ts";
import {IInterfaceTexts} from "storyScript/Interfaces/interfaceTexts.ts";
import {IGame} from "storyScript/Interfaces/game.ts";
import {CommonModule} from "@angular/common";
import {IRules} from "storyScript/Interfaces/rules/rules.ts";

@Component({
    standalone: true,
    selector: 'combat-participant',
    imports: [CommonModule],
    template: getTemplate('combatparticipant', await import('./combatparticipant.component.html?raw'))
})
export class CombatParticipantComponent {
    @Input() participant!: IEnemy | ICharacter;

    constructor() {
        const objectFactory = inject(ServiceFactory);
        this.game = objectFactory.GetGame();
        this.rules = objectFactory.GetRules();
        this.texts = objectFactory.GetTexts();
    }

    game: IGame;
    rules: IRules;
    texts: IInterfaceTexts;
}