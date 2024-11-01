import {IGame, Location} from '../../types';
import description from './Mermaid.html?raw';
import {Pearl} from '../../items/Pearl';
import {MagicFlower} from '../../items/MagicFlower.ts';
import {Beach} from "./Beach.ts";
import {equals} from "storyScript/utilityFunctions.ts";
import {ActionStatus} from "storyScript/Interfaces/enumerations/actionStatus.ts";

export function Mermaid() {
    return Location({
        name: 'Mermaid',
        description: description,
        picture: true,
        destinations: [
            {
                name: 'To the beach',
                target: Beach
            },
        ],
        actions:
            [[
                'Help',
                {
                    text: 'Help the Mermaid',
                    execute: (game: IGame) => {
                        game.activeCharacter.items.add(Pearl);
                        setCompleted(game, 'helpmermaid');
                    },
                    activeDay: true
                }
            ],
                [
                    'GiveFlower',
                    {
                        text: 'Give the Magic Flower to the Mermaid',
                        execute: (game: IGame) => {
                            game.helpers.removeItemFromParty(MagicFlower);
                            game.activeCharacter.items.add(Pearl);
                            setCompleted(game, 'giveflower');
                        },
                        activeNight: true,
                        status: hasFlower
                    }],
                [
                    'KeepFlower',
                    {
                        text: 'Keep the Magic Flower',
                        execute: (game: IGame) => {
                            setCompleted(game, 'refuseflower');

                        },
                        activeNight: true,
                        status: hasFlower
                    }
                ]],
        leaveEvents: [[
            'Leave',
            (game: IGame) => {
                game.currentLocation.descriptionSelector = null;
            }]]
    });

    function setCompleted(game: IGame, descriptionSelector: string) {
        game.currentLocation.descriptionSelector = descriptionSelector;
        game.currentLocation.actions.clear();
        game.currentLocation.completedDay = true;
        game.currentLocation.completedNight = true;
    }
}

function hasFlower(game: IGame) {
    return game.party.characters.find(c => c.items.find(i => equals(i, MagicFlower))) ? ActionStatus.Available : ActionStatus.Unavailable;
}