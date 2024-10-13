import {IGame, IPerson, IQuest, Quest} from '../types';
import {haveItem} from "../sharedFunctions.ts";
import {MagicFlower} from "../items/MagicFlower.ts";
import {BeeSting} from "../items/BeeSting.ts";

export function FlowerForTheQueen() {
    return Quest({
        name: 'Find the Magic Flower',
        status: (game: IGame, quest: IQuest, done: boolean) => {
            return haveItem(game, MagicFlower) ? 'You have the Magic Flower!' : 'You must find the Magic Flower!';
        },
        start: (game: IGame, quest: IQuest, person: IPerson) => {
        },
        checkDone: (game: IGame, quest: IQuest): boolean => {
            return game.worldProperties.helpedBees ?? false;
        },
        complete: (game: IGame, quest: IQuest, person: IPerson) => {
			game.worldProperties.helpedBees = true;
			game.activeCharacter.items.add(BeeSting);
			game.helpers.removeItemFromParty(MagicFlower);
        },
    });
}