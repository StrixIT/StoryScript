import { IGame, Location } from '../../types';
import description from './Mermaid.html';
import { Pearl } from '../../items/Pearl';
import { Magicflower } from '../../items/Magicflower';
import { Fisherman } from '../NorthForest/Fisherman';

export function Mermaid() {
    return Location({
        name: 'Mermaid',
        description: description,
        destinations: [
            {
                name: 'The Fisherman\'s cottage',
                target: Fisherman,
                style: 'location-danger'
            },  
        ],
        actions: [
            {
                text: 'Help the Mermaid',
                execute: (game: IGame) => {
                    game.activeCharacter.items.add(Pearl());
                    setCompleted(game, 'helpmermaid');
                },
                activeDay: true
            },
            {
                text: 'Give the Magic Flower to the Mermaid',
                execute: (game: IGame) => {
                    // Todo: should remove item from party.
                    game.activeCharacter.items.delete(Magicflower);
                    game.activeCharacter.items.add(Pearl());
                    setCompleted(game, 'giveflower');
                },
                activeNight: true
            },
            {
                text: 'Keep the Magic Flower',
                execute: (game: IGame) => {
                    setCompleted(game, 'refuseflower');
                    
                },
                activeNight: true
            },
        ],
        leaveEvents: [{
            'Leave':
            (game: IGame) => {
                game.currentLocation.descriptionSelector = null;
            }}
        ]
    });

    function setCompleted(game: IGame, descriptionSelector: string) {
        game.currentLocation.descriptionSelector = descriptionSelector;
        game.currentLocation.actions.clear();
        game.currentLocation.completedDay = true;
        game.currentLocation.completedNight = true;
    }
}