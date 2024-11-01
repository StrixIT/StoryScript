import {Location} from '../../types';
import description from './Darkcave.html?raw';
import {KoboldWizard} from "../../enemies/KoboldWizard.ts";

export function Darkcave() {
    return Location({
        name: 'The Dark Cave',
        description: description,
        picture: true,
        enemies: [
            KoboldWizard()
        ]
    });
}