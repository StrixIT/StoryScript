import { IGame, IQuest, Quest, IPerson } from '../types';
import * as Items from '../items/journal'

export function Journal() {
    return Quest({
        name: 'Find Joe\'s journal',
        status: (game: IGame, quest: IQuest, done: boolean) => {
            return 'You have ' + (done ? '' : 'not ') + 'found Joe\'s journal' + (done ? '!' : ' yet.');
        },
        start: (game: IGame, quest: IQuest, person: IPerson) => {
        },
        checkDone: (game: IGame, quest: IQuest) => {
            return quest.completed || game.character.items.get(Items.Journal) != null;
        },
        complete: (game: IGame, quest: IQuest, person: IPerson) => {
            var ring = game.character.items.get(Items.Journal);
            game.character.items.remove(ring);
            game.character.currency += 5;
        }
    });
}