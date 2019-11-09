import { Quest } from '../interfaces/types';
import { RegisterQuest } from '../../../Engine/Interfaces/storyScript'
import * as Items from '../items/journal'

export function Journal() {
    return Quest({
        name: 'Find Joe\'s journal',
        status: (game, quest, done) => {
            return 'You have ' + (done ? '' : 'not ') + 'found Joe\'s journal' + (done ? '!' : ' yet.');
        },
        start: (game, quest, person) => {
        },
        checkDone: (game, quest) => {
            return quest.completed || game.character.items.get(Items.Journal) != null;
        },
        complete: (game, quest, person) => {
            var ring = game.character.items.get(Items.Journal);
            game.character.items.remove(ring);
            game.character.currency += 5;
        }
    });
}

RegisterQuest(Journal);