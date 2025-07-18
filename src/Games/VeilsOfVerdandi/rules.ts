import {ICharacter, IRules, PlayState} from 'storyScript/Interfaces/storyScript';
import {Character, IGame, IInterfaceTexts, IItem} from './types';
import {combatRules} from "./combatRules.ts";
import {canEquip, characterRules} from "./characterRules.ts";
import {explorationRules} from "./explorationRules.ts";
import {IGroupableItem} from "./interfaces/item.ts";
import {ITrade} from "./interfaces/trade.ts";

export function Rules(): IRules {
    return {
        setup: {
            numberOfCharacters: 3,
            gameStart: (game: IGame): void => {
                game.party.currency ??= 0;
                game.worldProperties = {
                    currentDay: 1,
                    isDay: true,
                    isNight: false,
                    timeOfDay: 'day',
                    freedFaeries: false,
                    travelCounter: 0,
                    hasRestedDuringDay: false,
                    hasRestedDuringNight: false,
                    helpedBees: false,
                    helpedDryad: false
                };
                
                init(game);
            },
            initGame: init,
            continueGame: continueGame,
            intro: true
        },

        general: {
            scoreChange: (game: IGame, change: number): boolean => {
                // Implement logic to occur when the score changes. Return true when the character gains a level.
                return false;
            },
            getItemName(item: IGroupableItem, texts: IInterfaceTexts): string {
                if (!item.members?.length) {
                    return item.name;
                } else if (item.members && item.id === item.members[0].id) {
                    return texts.format(item.groupName, [(item.members.length + 1).toString()]);
                }

                return `${item.name} / ${item.members[0].name}`;
            },
            canBuyItem(game: IGame, item: IItem, buyer: ITrade | ICharacter): boolean {
                if (!item.itemClass) {
                    return true;
                }
                
                if ((<Character>buyer).class) {
                    return canEquip(item, buyer as Character);
                }
                
                return true;
            },
            playStateChange(game: IGame, newPlayState: PlayState, oldPlayState: PlayState) {
                game.delayedDescriptionChanges ??= [];
                
                if (!newPlayState && oldPlayState && game.delayedDescriptionChanges.length) {
                    game.delayedDescriptionChanges.forEach(f => f());
                    game.delayedDescriptionChanges.length = 0;
                }
            }
        },

        character: characterRules,
        combat: combatRules,
        exploration: explorationRules
    };
}

function init(game: IGame) {
    if (game.locations?.start) {
        game.locations.start.hotSpotCleared = true;
        addDescriptions(game);
    }

    initTime(game);
}

function continueGame(game: IGame) {
    explorationRules.enterLocation(game, game.currentLocation, false);
    initTime(game);
}

function initTime(game: IGame) {
    game.changeTime = s => changeTime(game, s);
    setTimeout(() => {
        setTime(game);
    });
}

function changeTime(game: IGame, e: string) {
    game.worldProperties.timeOfDay = e;
    setTime(game);
    explorationRules.enterLocation(game, game.currentLocation, false);
}

function setTime(game: IGame) {
    game.UIRootElement.classList.remove('day');
    game.UIRootElement.classList.remove('night');

    if (game.worldProperties.timeOfDay === 'day') {
        game.worldProperties.isDay = true;
        game.worldProperties.isNight = false;
        game.UIRootElement.classList.add('day');
    } else {
        game.worldProperties.isDay = false;
        game.worldProperties.isNight = true;
        game.UIRootElement.classList.add('night');
    }
}

function addDescriptions(game: IGame) {
    Object.keys(game.locations).forEach(k => {
        const location = game.locations[k];

        if (location.isHotspot) {
            return;
        }

        if (!location.descriptions['daycompleted']) {
            location.descriptions['daycompleted'] = 'It is day. There is nothing left for you to do here';
        }

        if (!location.descriptions['nightcompleted']) {
            location.descriptions['nightcompleted'] = 'It is night. There is nothing left for you to do here';
        }
    });
}