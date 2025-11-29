import {IRules} from '../Interfaces/rules/rules';
import {IGame} from '../Interfaces/game';
import {IInterfaceTexts} from '../Interfaces/interfaceTexts';
import {ISaveGame} from '../Interfaces/saveGame';
import {IItem} from '../Interfaces/item';
import {ScoreEntry} from '../Interfaces/scoreEntry';
import {checkAutoplay} from './sharedFunctions';
import {DefaultTexts} from '../defaultTexts';
import {IGameService} from '../Interfaces/services//gameService';
import {IDataService} from '../Interfaces/services//dataService';
import {ILocationService} from '../Interfaces/services/locationService';
import {ICharacterService} from '../Interfaces/services/characterService';
import {ICombinationService} from '../Interfaces/services/combinationService';
import {GameState} from '../Interfaces/enumerations/gameState';
import {PlayState} from '../Interfaces/enumerations/playState';
import {ICombinable} from '../Interfaces/combinations/combinable';
import {IFeature} from '../Interfaces/feature';
import {IParty} from '../Interfaces/party';
import {ICreateCharacter} from '../Interfaces/createCharacter/createCharacter';
import {IHelpers} from "storyScript/Interfaces/helpers.ts";
import {Characters, GameStateSave, HighScores, Items, Quests, SaveGamePrefix} from "../../../constants.ts";
import {getParsedDocument, InitEntityCollection} from "storyScript/EntityCreatorFunctions.ts";
import {IEquipment} from "storyScript/Interfaces/equipment.ts";
import {ICombineResult} from "storyScript/Interfaces/combinations/combineResult.ts";
import {ISoundService} from "storyScript/Interfaces/services/ISoundService.ts";
import {gameEvents} from "storyScript/gameEvents.ts";
import {GameEventNames} from "storyScript/GameEventNames.ts";

export class GameService implements IGameService {
    constructor
    (
        private readonly _dataService: IDataService,
        private readonly _locationService: ILocationService,
        private readonly _characterService: ICharacterService,
        private readonly _combinationService: ICombinationService,
        private readonly _soundService: ISoundService,
        private readonly _rules: IRules,
        private readonly _helperService: IHelpers,
        private readonly _game: IGame,
        private readonly _texts: IInterfaceTexts,
    ) {
    }

    init = (restart?: boolean, skipIntro?: boolean): void => {
        this._game.helpers = this._helperService;

        const gameState = this._dataService.load<ISaveGame>(GameStateSave);
        this._game.highScores = this._dataService.load<ScoreEntry[]>(HighScores);
        this._game.party = gameState?.party;
        this._game.locations = gameState?.world;
        this._game.maps = gameState?.maps;
        this._game.worldProperties = gameState?.worldProperties ?? {};
        this._game.statistics = gameState?.statistics ?? this._game.statistics ?? {};
        const playedAudio = gameState?.playedAudio ?? [];

        if (restart) {
            this._game.statistics = {};
            this._game.worldProperties = {};
        }

        this._rules.setup?.initGame?.(this._game);
        this.initGame(playedAudio);
        this.initTexts();

        // Use the afterSave hook here to combine the initialized world with other saved data.
        if (gameState && this._rules.general?.afterSave) {
            this._rules.general.afterSave(this._game);
        }

        if (!this._game.party && this._rules.setup.intro && !skipIntro) {
            this._game.state = GameState.Intro;
            return;
        }

        let locationName = this._game.party?.currentLocationId;
        const characterSheet = this._rules.character.getCreateCharacterSheet?.();
        const hasCreateCharacterSteps = characterSheet?.steps?.length > 0;
        let isNewGame = false;

        if (!hasCreateCharacterSteps && !this._game.party) {
            isNewGame = true;
            locationName = 'Start';
            this.startNewGame(<ICreateCharacter>{});
        }

        if (this._game.party && locationName) {
            this.resume(locationName, !isNewGame);

            if (!isNewGame && this._rules.setup.continueGame) {
                this._rules.setup.continueGame(this._game);
            }
        } else {
            this._characterService.setupCharacter();
            this._game.state = GameState.CreateCharacter;
        }
    }

    reset = (): void => {
        const emptySave = <ISaveGame>{
            party: this._game.party,
            statistics: this._game.statistics
        };

        this._dataService.save(GameStateSave, emptySave);
        this._game.locations = null;
        this._game.maps = null;
        this._locationService.init();

        // Save here to use the before and after save hooks after refreshing the world,
        // if there is a beforeSave hook defined.
        if (this._rules.general?.beforeSave) {
            this._dataService.saveGame(this._game);
        }

        if (this._game.party?.currentLocationId) {
            this._game.changeLocation(this._game.party.currentLocationId, false);
        }
    }

    startNewGame = (characterData: ICreateCharacter): void => {
        this.createCharacter(characterData);

        if (this._rules.setup.numberOfCharacters > 1 && this._rules.setup.numberOfCharacters > this._game.party.characters.length) {
            this._characterService.setupCharacter();
            return;
        }

        this._game.party.characters[0].isActiveCharacter = true;
        this._rules.setup.gameStart?.(this._game);

        if (!this._game.currentLocation) {
            this._game.changeLocation('Start');
        }

        this.setInterceptors();
        this._game.state = GameState.Play;
        this._dataService.saveGame(this._game);
    }

    restart = (skipIntro?: boolean): void => {
        this._dataService.remove(GameStateSave);
        this.init(true, skipIntro);
    }

    loadGame = (name: string): void => {
        const saveGame = this._dataService.load<ISaveGame>(SaveGamePrefix + name);

        if (saveGame) {
            this._game.loading = true;
            this._game.party = saveGame.party;
            this._game.locations = saveGame.world;
            this._game.maps = saveGame.maps;
            this._game.worldProperties = saveGame.worldProperties ?? {};
            this._game.statistics = saveGame.statistics;
            this._game.sounds.playedAudio = saveGame.playedAudio;
            this._locationService.init();
            this._game.currentLocation = this._game.locations.get(saveGame.party.currentLocationId);

            // Use the afterSave hook here to combine the loaded world with other saved data.
            this._rules.general?.afterSave?.(this._game);

            if (saveGame.party.previousLocationId) {
                this._game.previousLocation = this._game.locations.get(saveGame.party.previousLocationId);
            }

            this._game.actionLog = [];
            this.setInterceptors();

            if (this._game.playState === PlayState.Menu) {
                this._game.playState = null;
            }

            this._game.combinations.combinationResult.reset();
            this._locationService.processDestinations(this._game);
            this._locationService.loadLocationDescriptions(this._game);
            this._rules.setup.continueGame?.(this._game);

            // Use a timeout here to allow the UI to respond to the loading flag set.
            setTimeout(() => {
                this._game.loading = false;
                this._game.state = GameState.Play;
                gameEvents.publish(GameEventNames.ChangeLocation, { location: this._game.currentLocation });
            }, 0);
        }
    }

    watchPlayState(callBack: (game: IGame, newPlayState: PlayState, oldPlayState: PlayState) => void): void {
        this.watchState<PlayState>('playState', callBack);
    }

    private readonly resume = (locationName: string, setInterceptors: boolean): void => {
        if (!this._game.party.characters.some(c => c.currentHitpoints > 0)) {
            this._game.state = GameState.GameOver;
            return;
        }

        if (setInterceptors) {
            this.setInterceptors();
        }

        this._characterService.checkEquipment();
        const lastLocation = locationName && this._game.locations.get(locationName) || this._game.locations.start;
        const previousLocationName = this._game.party.previousLocationId;

        if (previousLocationName) {
            this._game.previousLocation = this._game.locations.get(previousLocationName);
        }

        this._game.changeLocation(lastLocation.id, false);
        this._game.state = GameState.Play;
    }

    private watchState<T>(stateName: string, callBack: (game: IGame, newState: T, oldState: T) => void) {
        const watcherNames = `_${stateName}Watchers`;
        const watchers = this[watcherNames] ?? [];
        this[watcherNames] = watchers;

        if (watchers.length === 0) {
            let state = this._game[stateName];

            Object.defineProperty(this._game, stateName, {
                enumerable: true,
                configurable: true,
                get: () => {
                    return state;
                },
                set: value => {
                    const oldState = state;
                    state = value;
                    watchers.forEach(w => w(this._game, state, oldState));
                }
            });
        }

        if (watchers.indexOf(callBack) < 0) {
            watchers.push(callBack);
        }
    }

    private readonly initTexts = (): void => {
        const defaultTexts = new DefaultTexts();

        for (const n in defaultTexts.texts) {
            this._texts[n] = this._texts[n] ? this._texts[n] : defaultTexts.texts[n];
        }

        this._texts.format = defaultTexts.format;
        this._texts.titleCase = defaultTexts.titleCase;
    }

    private readonly createCharacter = (characterData: ICreateCharacter): void => {
        this._game.party = this._game.party ?? <IParty>{
            type: 'party',
            characters: [],
            quests: [],
            score: 0
        };

        const character = this._characterService.createCharacter(this._game, characterData);
        (<any>character).type = 'character';
        character.items = character.items || [];
        this._game.party.characters.push(character);
    }

    private readonly initGame = (playedAudio: string[]): void => {
        this.initLogs();

        Object.defineProperty(this._game, 'activeCharacter', {
            configurable: true,
            get: () => {
                const characters = this._game.party.characters;
                let character = characters.filter(c => c.isActiveCharacter)[0] ?? characters.filter(c => c.currentHitpoints > 0)[0];

                if (!character.isActiveCharacter) {
                    character.isActiveCharacter = true;
                }

                return character;

            },
            set: value => {
                if (!value || value.currentHitpoints <= 0) {
                    return;
                }

                this._game.party.characters.forEach(c => c.isActiveCharacter = false);
                value.isActiveCharacter = true;
            }
        });

        this._game.sounds = this._soundService.getSounds();
        this._game.sounds.playedAudio = playedAudio;

        this.initCombinations();
        this._locationService.init();

        gameEvents.register(GameEventNames.ChangeLocation, false);
        
        this._game.changeLocation = (location, travel) => {
            this._locationService.changeLocation(location, travel, this._game);
            gameEvents.publish(GameEventNames.ChangeLocation, { location, travel });

            if (travel) {
                this._dataService.saveGame(this._game);
            }
        };

        Object.defineProperty(this._game, 'currentMap', {
            configurable: true,
            get: () => {
                let result = null;
                
                if (this._game.maps) {
                    for (const key in this._game.maps)
                    {
                        const map = this._game.maps[key];
                        const location = map.locations.find(l => l.location === this._game.currentLocation.id);
                        
                        if (location) {
                            result = map;
                            break;
                        }
                    }
                }
                
                return result;
            }
        });

        if (this._rules.general?.gameStateChange) {
            this.watchState<GameState>('state', this._rules.general.gameStateChange);
        }

        if (this._rules.general?.playStateChange) {
            this.watchState<PlayState>('playState', this._rules.general.playStateChange);
        }
    }

    private readonly setInterceptors = (): void => {
        const defaultPartyName = this._game.party.name ?? '';
        let score = this._game.party.score || 0;
        let gameState = this._game.state;
        let currentDescription = this._game.currentDescription;
        let currentHitpoints: Map<string, number> = new Map<string, number>();

        InitEntityCollection(this._game.party, Quests);
        InitEntityCollection(this._game.party, Characters);

        Object.defineProperty(this._game.party, 'name', {
            configurable: true,
            get: () => {
                let partyName = defaultPartyName;

                if (!partyName) {
                    this._game.party.characters.forEach((c, i) => {
                        const separator = i == this._game.party.characters.length - 1 ? ' & ' : ', ';

                        if (partyName) {
                            partyName += separator;
                        }

                        partyName += c.name;
                    });
                }

                return partyName;

            }
        });

        this._game.party.characters.forEach(c => {
            InitEntityCollection(c, Items);
            currentHitpoints[c.name] = c.currentHitpoints ?? c.hitpoints;

            Object.defineProperty(c, 'currentHitpoints', {
                configurable: true,
                get: () => {
                    return currentHitpoints[c.name];
                },
                set: value => {
                    const change = value - currentHitpoints[c.name];
                    currentHitpoints[c.name] = value;
                    this._rules.character.hitpointsChange?.(this._game, c, change);

                    if (currentHitpoints[c.name] <= 0) {
                        this._game.activeCharacter = this._game.party.characters.find(c => c.currentHitpoints > 0);
                    }
                }
            });

            Object.defineProperty(c, 'combatItems', {
                get: function () {
                    const result = c.items.filter(i => {
                        return canUseInCombat(i.useInCombat, i, c.equipment);
                    });

                    for (const n in c.equipment) {
                        const item = <IItem>c.equipment[n];

                        if (item && canUseInCombat(item.useInCombat, item, c.equipment)) {
                            result.push(item);
                        }
                    }

                    return result;
                }
            });
        });

        Object.defineProperty(this._game.party, 'score', {
            configurable: true,
            get: () => {
                return score;
            },
            set: value => {
                const change = value - score;
                score = value;

                // Todo: separate score and xp(?)
                // Change when xp can be lost.
                if (change > 0) {
                    const levelUp = this._rules.general?.scoreChange?.(this._game, change);

                    if (levelUp) {
                        this._game.playState = null;
                        this._game.state = GameState.LevelUp;
                        this._characterService.setupLevelUp();
                    }
                }
            }
        });

        Object.defineProperty(this._game, 'state', {
            configurable: true,
            get: () => {
                return gameState;
            },
            set: state => {
                if (state === GameState.GameOver || state === GameState.Victory) {
                    this._game.playState = null;
                    this._rules.general?.determineFinalScore?.(this._game);
                    this.updateHighScore();
                    this._dataService.save(HighScores, this._game.highScores);
                }

                gameState = state;
            }
        });

        Object.defineProperty(this._game, 'currentDescription', {
            configurable: true,
            get: () => {
                return currentDescription;
            },
            set: (value: { title: string, type: string, item: IFeature }) => {
                currentDescription = value;

                if (currentDescription.item.description) {
                    currentDescription.item.description = checkAutoplay(this._game, getParsedDocument('description', currentDescription.item.description, true)[0].innerHTML);
                }

                this._game.playState = PlayState.Description;
            }
        });
    }

    private readonly initLogs = (): void => {
        this._game.actionLog = [];
        this._game.combatLog = [];

        this._game.logToLocationLog = (message: string) => {
            this._game.currentLocation.log ??= [];
            this._game.currentLocation.log.push(message);
        }

        this._game.logToActionLog = (message: string) => {
            this._game.actionLog.splice(0, 0, message);
        }

        this._game.logToCombatLog = (message: string) => {
            this._game.combatLog.splice(0, 0, message);
        }
    }

    private readonly initCombinations = (): void => {
        this._game.combinations = {
            combinationResult: {
                done: false,
                text: null,
                featuresToRemove: [],
                reset: (): void => {
                    const result = this._game.combinations.combinationResult;
                    result.done = false;
                    result.text = null;
                    result.featuresToRemove.length = 0;
                }
            },
            activeCombination: null,
            tryCombine: (target: ICombinable): ICombineResult => {
                const activeCombo = this._game.combinations.activeCombination;
                const result = this._combinationService.tryCombination(target);

                if (result.text) {
                    let featuresToRemove: string[] = [];

                    if (result.success) {
                        if (result.removeTarget) {
                            featuresToRemove.push(target.id);
                        }

                        if (result.removeTool) {
                            featuresToRemove.push(activeCombo.selectedTool.id);
                        }

                        this._game.combinations.combinationResult.featuresToRemove = featuresToRemove;
                        this._dataService.saveGame(this._game);
                    }
                }

                return result;
            },
            getCombineClass: (tool: ICombinable): string => {
                return this._combinationService.getCombineClass(tool);
            }
        };
    }

    private readonly updateHighScore = (): void => {
        const scoreEntry = {name: this._game.party.name, score: this._game.party.score};
        this._game.highScores ??= [];
        let scoreAdded = false;

        this._game.highScores.forEach((entry) => {
            if (this._game.party.score > entry.score && !scoreAdded) {
                const index = this._game.highScores.indexOf(entry);

                if (this._game.highScores.length >= 5) {
                    this._game.highScores.splice(index, 1, scoreEntry);
                } else {
                    this._game.highScores.splice(index, 0, scoreEntry);
                }

                scoreAdded = true;
            }
        });

        if (this._game.highScores.length < 5 && !scoreAdded) {
            this._game.highScores.push(scoreEntry);
        }

        this._dataService.save(HighScores, this._game.highScores);
    }
}

function canUseInCombat(flagOrFunction: boolean | ((item: IItem, equipment: IEquipment) => boolean), item: IItem, equipment: {}) {
    const canUse = (typeof flagOrFunction === "function") ? flagOrFunction(item, equipment) : flagOrFunction;

    if (canUse && !item.use) {
        console.log(`Item ${item.name} declares it can be used in combat but has no use function.`)
    }

    return canUse;
}
