import {Location} from '../../types';
import description from './Darkcave.html?raw';
import {KoboldWizard} from "../../enemies/KoboldWizard.ts";
import {ActionType} from "storyScript/Interfaces/enumerations/actionType.ts";
import {GameState} from "storyScript/Interfaces/storyScript.ts";

export function Darkcave() {
    return Location({
        name: 'The Dark Cave',
        description: description,
        picture: true,
        enemies: [
            KoboldWizard()
        ],
        actions: [[
            'FinalScore', {
                text: 'Final Score',
                actionType: ActionType.Regular,
                execute: game => {
                    game.state = GameState.Victory;
                }
            }
        ]]
    });
}