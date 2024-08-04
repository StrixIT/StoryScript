import {IRules} from '../Interfaces/rules/rules';
import {IGame} from '../Interfaces/game';
import {IInterfaceTexts} from '../Interfaces/interfaceTexts';
import {ICharacter} from '../Interfaces/character';
import {ISaveGame} from '../Interfaces/saveGame';
import {IEnemy} from '../Interfaces/enemy';
import {IItem} from '../Interfaces/item';
import {IBarrier} from '../Interfaces/barrier';
import {IDestination} from '../Interfaces/destination';
import {ScoreEntry} from '../Interfaces/scoreEntry';
import {checkAutoplay, removeItemFromItemsAndEquipment, selectStateListEntry} from './sharedFunctions';
import {DefaultTexts} from '../defaultTexts';
import {IGameService} from '../Interfaces/services//gameService';
import {IDataService} from '../Interfaces/services//dataService';
import {ILocationService} from '../Interfaces/services/locationService';
import {ICharacterService} from '../Interfaces/services/characterService';
import {ICombinationService} from '../Interfaces/services/combinationService';
import {IBarrierAction} from '../Interfaces/barrierAction';
import {GameState} from '../Interfaces/enumerations/gameState';
import {PlayState} from '../Interfaces/enumerations/playState';
import {ICombinable} from '../Interfaces/combinations/combinable';
import {IFeature} from '../Interfaces/feature';
import {IParty} from '../Interfaces/party';
import {ICreateCharacter} from '../Interfaces/createCharacter/createCharacter';
import {ICombatSetup} from '../Interfaces/combatSetup';
import {ICombatTurn} from '../Interfaces/combatTurn';
import {TargetType} from '../Interfaces/enumerations/targetType';
import {IHelpers} from "storyScript/Interfaces/helpers.ts";
import {Characters, DefaultSaveGame, HighScores, Items, Quests} from "../../../constants.ts";
import {getParsedDocument, InitEntityCollection} from "storyScript/EntityCreatorFunctions.ts";
import {IEquipment} from "storyScript/Interfaces/equipment.ts";
import {ICombineResult} from "storyScript/Interfaces/combinations/combineResult.ts";

export class GameService implements IGameService {
    private _parsedDescriptions = new Map<string, boolean>();
    private _musicStopped: boolean = false;

    constructor(private _dataService: IDataService, private _locationService: ILocationService, private _characterService: ICharacterService, private _combinationService: ICombinationService, private _rules: IRules, private _helperService: IHelpers, private _game: IGame, private _texts: IInterfaceTexts) {
    }

    init = (restart?: boolean, skipIntro?: boolean): void => {
        this._game.helpers = this._helperService;

        if (restart) {
            this._game.statistics = {};
            this._game.worldProperties = {};
        }

        const saveGame = this._dataService.load<ISaveGame>(DefaultSaveGame) ?? <ISaveGame>{};
        this._game.highScores = this._dataService.load<ScoreEntry[]>(HighScores);
        this._game.party = saveGame.party;
        this.setReadOnlyPartyProperties(this._game.party);
        this._game.locations = saveGame.world;
        this._game.worldProperties = saveGame.worldProperties ?? {};

        if (!restart) {
            this._game.statistics = saveGame.statistics || this._game.statistics || {};
        }

        const playedAudio = saveGame.playedAudio ?? [];

        this._rules.setup?.setupGame?.(this._game);
        this.setupGame(playedAudio);
        this.initTexts();

        // Use the afterSave hook here to combine the initialized world with other saved data.
        if (this._rules.general?.afterSave) {
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
            this.resume(locationName);

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

        this._dataService.save(DefaultSaveGame, emptySave);
        this._locationService.init();

        // Save here to use the before and after save hooks after refreshing the world,
        // if there is a beforeSave hook defined.
        if (this._rules.general?.beforeSave) {
            this.saveGame();
        }

        if (this._game.party?.currentLocationId) {
            this._locationService.changeLocation(this._game.party.currentLocationId, false, this._game);
        }
    }

    startNewGame = (characterData: ICreateCharacter): void => {
        this.createCharacter(characterData);

        if (this._rules.setup.numberOfCharacters > 1 && this._rules.setup.numberOfCharacters > this._game.party.characters.length) {
            this._characterService.setupCharacter();
            return;
        }

        this.setReadOnlyPartyProperties(this._game.party);
        this._game.party.characters[0].isActiveCharacter = true;
        this._rules.setup.gameStart?.(this._game);
        this._game.changeLocation?.('Start');
        this.initSetInterceptors();
        this._game.state = GameState.Play;
        this.saveGame();
    }

    levelUp = (character: ICharacter): ICharacter => {
        const levelUpResult = this._characterService.levelUp(character);
        this.saveGame();
        return levelUpResult;
    }

    restart = (skipIntro?: boolean): void => {
        this._dataService.remove(DefaultSaveGame);
        this.init(true, skipIntro);
    }

    loadGame = (name: string): void => {
        const saveGame = this._dataService.load<ISaveGame>(name);

        if (saveGame) {
            this._game.loading = true;
            this._game.party = saveGame.party;
            this._game.locations = saveGame.world;
            this._game.worldProperties = saveGame.worldProperties;
            this._game.statistics = saveGame.statistics;
            this._game.sounds.playedAudio = saveGame.playedAudio;
            this._locationService.init();
            this._game.currentLocation = this._game.locations.get(saveGame.party.currentLocationId);

            // Use the afterSave hook here combine the loaded world with other saved data.
            if (this._rules.general?.afterSave) {
                this._rules.general.afterSave(this._game);
            }

            if (saveGame.party.previousLocationId) {
                this._game.previousLocation = this._game.locations.get(saveGame.party.previousLocationId);
            }

            this._game.actionLog = [];
            this.initSetInterceptors();

            if (this._game.playState === PlayState.Menu) {
                this._game.playState = null;
            }

            this._game.combinations.combinationResult.reset();
            this._locationService.loadLocationDescriptions(this._game);

            if (this._rules.setup.continueGame) {
                this._rules.setup.continueGame(this._game);
            }

            // Use a timeout here to allow the UI to respond to the loading flag set.
            setTimeout(() => {
                this._game.loading = false;
            }, 0);
        }
    }

    getSaveGames = (): string[] => this._dataService.getSaveKeys();

    hasDescription = (entity: { id?: string, description?: string }): boolean => {
        if (!entity.description) {
            return false;
        }

        if (!this._parsedDescriptions.get(entity.id)) {
            const descriptionNode = getParsedDocument('description', entity.description)[0];
            this._parsedDescriptions.set(entity.id, descriptionNode?.innerHTML?.trim() !== '');
        }

        return this._parsedDescriptions.get(entity.id);
    }

    initCombat = (): void => {
        this._rules.combat?.initCombat?.(this._game, this._game.currentLocation);
        this.initCombatRound(true);
        this._game.currentLocation.activeEnemies.forEach(enemy => enemy.onAttack?.(this._game));
        this._game.playState = PlayState.Combat;
    }

    fight = (combatRound: ICombatSetup<ICombatTurn>, retaliate?: boolean): Promise<void> | void => {
        if (!this._rules.combat?.fight) {
            return;
        }

        const promise = this._rules.combat.fight(this._game, combatRound, retaliate);

        return Promise.resolve(promise).then(() => {
            combatRound.forEach((s, i) => {
                if (s.target?.currentHitpoints <= 0) {
                    this.enemyDefeated(this._game.party.characters[i], s.target);
                }
            });

            if (this._game.party.characters.filter(c => c.currentHitpoints >= 0).length == 0) {
                this._game.playState = null;
                this._game.state = GameState.GameOver;
            }

            this.saveGame();
            this.initCombatRound(false);
        });
    }

    useItem = (character: ICharacter, item: IItem, target?: IEnemy): Promise<void> | void => {
        const useItem = (this._rules.exploration?.onUseItem?.(this._game, character, item) && item.use) ?? item.use;

        if (useItem) {
            const promise = item.use(this._game, character, item, target);

            return Promise.resolve(promise).then(() => {
                if (item.charges !== undefined) {
                    if (!isNaN(item.charges)) {
                        item.charges--;
                    }

                    if (item.charges <= 0) {
                        removeItemFromItemsAndEquipment(character, item);
                    }
                }
            });
        }
    }

    executeBarrierAction = (barrier: [string, IBarrier], action: [string, IBarrierAction], destination: IDestination): void => {
        action[1].execute(this._game, barrier, destination);
        barrier[1].actions.delete(barrier[1].actions.find(([k, _]) => k === action[0]));
        this.saveGame();
    }

    getCurrentMusic = (): string => {
        if (this._musicStopped || !this._rules.setup?.playList || Object.keys(this._rules.setup.playList).length === undefined) {
            return null;
        }

        return selectStateListEntry(this._game, this._rules.setup.playList);
    }

    startMusic = (): boolean => this._musicStopped = false;

    stopMusic = (): boolean => this._musicStopped = true;

    playSound = (fileName: string, completeCallBack?: () => void): void => {
        this._game.sounds.soundQueue.set(this.createHash(fileName + Math.floor(Math.random() * 1000)), {
            value: fileName,
            playing: false,
            completeCallBack: completeCallBack
        });
    }

    watchGameState(callBack: (game: IGame, newGameState: GameState, oldGameState: GameState) => void): void {
        this.watchState<GameState>('state', callBack);
    }

    watchPlayState(callBack: (game: IGame, newPlayState: PlayState, oldPlayState: PlayState) => void): void {
        this.watchState<PlayState>('playState', callBack);
    }

    watchState<T>(stateName: string, callBack: (game: IGame, newState: T, oldState: T) => void) {
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

    saveGame = (name?: string): void => {
        name ??= DefaultSaveGame;
        this._rules.general?.beforeSave?.(this._game);

        const saveGame = <ISaveGame>{
            party: this._game.party,
            world: this._game.locations,
            worldProperties: this._game.worldProperties,
            statistics: this._game.statistics,
            playedAudio: this._game.sounds.playedAudio
        };

        this._dataService.save(name, saveGame);

        if (this._game.playState === PlayState.Menu) {
            this._game.playState = null;
        }

        this._rules.general.afterSave?.(this._game);
    }

    private setReadOnlyPartyProperties = (party: IParty) => {
        if (!party) {
            return;
        }

        InitEntityCollection(party, Quests);
        InitEntityCollection(party, Characters);

        party.characters.forEach(c => {
            InitEntityCollection(c, Items);

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
    }

    private initTexts = (): void => {
        const defaultTexts = new DefaultTexts();

        for (const n in defaultTexts.texts) {
            this._texts[n] = this._texts[n] ? this._texts[n] : defaultTexts.texts[n];
        }

        this._texts.format = defaultTexts.format;
        this._texts.titleCase = defaultTexts.titleCase;
    }

    private resume = (locationName: string): void => {
        this.initSetInterceptors();
        const lastLocation = this._game.locations.get(locationName) || this._game.locations.start;
        const previousLocationName = this._game.party.previousLocationId;

        if (previousLocationName) {
            this._game.previousLocation = this._game.locations.get(previousLocationName);
        }

        this._locationService.changeLocation(lastLocation.id, false, this._game);
        this._game.state = GameState.Play;
    }

    private createCharacter = (characterData: ICreateCharacter): void => {
        this._game.party = this._game.party ?? <IParty>{
            characters: [],
            quests: [],
            score: 0
        };

        const character = this._characterService.createCharacter(this._game, characterData);
        character.items = character.items || [];
        this._game.party.characters.push(character);
    }

    private initCombatRound = (newFight: boolean) => {
        const enemies = this._game.currentLocation.activeEnemies;

        if (newFight) {
            this._game.combat = <ICombatSetup<ICombatTurn>>[];
            enemies.forEach(e => e.currentHitpoints = e.hitpoints);
            this._game.combat.round = 0;
        }

        this._game.combat.round++;

        this._game.party.characters.forEach((c, i) => {
            const allies = this._game.party.characters.filter(a => a != c);
            const items = c.combatItems ?? [];

            Object.keys(c.equipment).forEach(k => {
                const item = <IItem>c.equipment[k];

                if (item?.useInCombat || item?.targetType) {
                    items.push(item)
                }
            });

            items.sort((a: IItem, b: IItem) => b.targetType.localeCompare(a.targetType) || a.name.localeCompare(b.name));

            const targetType = items[0]?.targetType ?? TargetType.Enemy;

            this._game.combat[i] = <ICombatTurn>{
                character: c,
                targetsAvailable: enemies.concat(allies),
                target: targetType === TargetType.Enemy ? enemies[0] : allies[0],
                itemsAvailable: items,
                item: items[0]
            };
        });

        this._rules.combat?.initCombatRound?.(this._game, this._game.combat);
    }

    private enemyDefeated = (character: ICharacter, enemy: IEnemy): void => {
        if (enemy.items) {
            const items = [...enemy.items];

            items.forEach((item: IItem) => {
                if (!this._rules.combat?.beforeDrop || this._rules.combat.beforeDrop(this._game, character, enemy, item)) {
                    enemy.items.delete(item);
                    this._game.currentLocation.items.add(item);
                }
            });
        }

        if (enemy.currency) {
            this._game.party.currency ??= 0;
            this._game.party.currency += enemy.currency || 0;
        }

        this._game.statistics.enemiesDefeated ??= 0;
        this._game.statistics.enemiesDefeated += 1;
        this._game.currentLocation.enemies.delete(enemy);
        this._rules.combat?.enemyDefeated?.(this._game, character, enemy);
        enemy.onDefeat?.(this._game);
    }

    private setupGame = (playedAudio: string[]): void => {
        this.initLogs();

        Object.defineProperty(this._game, 'activeCharacter', {
            configurable: true,
            get: () => {
                const result = this._game.party.characters.filter(c => c.isActiveCharacter)[0] ?? this._game.party.characters[0];

                if (!result.isActiveCharacter) {
                    result.isActiveCharacter = true;
                }

                return result;

            },
            set: value => {
                this._game.party.characters.forEach(c => c.isActiveCharacter = false);
                value.isActiveCharacter = true;
            }
        });

        this._game.fight = this.fight;
        this._game.sounds = {
            startMusic: this.startMusic,
            stopMusic: this.stopMusic,
            playSound: this.playSound,
            soundQueue: new Map<number, { value: string, playing: boolean, completeCallBack?: () => void }>,
            playedAudio: playedAudio
        };

        this.setupCombinations();
        this._locationService.init();

        this._game.changeLocation = (location, travel) => {
            this._locationService.changeLocation(location, travel, this._game);

            if (travel) {
                this.saveGame();
            }
        };

        if (this._rules.general?.gameStateChange) {
            this.watchState<GameState>('state', this._rules.general.gameStateChange);
        }

        if (this._rules.general?.playStateChange) {
            this.watchState<PlayState>('playState', this._rules.general.playStateChange);
        }
    }

    private initSetInterceptors = (): void => {
        const defaultPartyName = this._game.party.name ?? '';
        let score = this._game.party.score || 0;
        let gameState = this._game.state;
        let currentDescription = this._game.currentDescription;
        let currentHitpoints: Map<string, number> = new Map<string, number>();

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
            currentHitpoints[c.name] = c.currentHitpoints || c.hitpoints;

            Object.defineProperty(c, 'currentHitpoints', {
                configurable: true,
                get: () => {
                    return currentHitpoints[c.name];
                },
                set: value => {
                    const change = value - currentHitpoints[c.name];
                    currentHitpoints[c.name] = value;
                    this._rules.character.hitpointsChange?.(this._game, c, change);
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

    private initLogs = (): void => {
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

    private setupCombinations = (): void => {
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
                        this.saveGame();
                    }
                }

                return result;
            },
            getCombineClass: (tool: ICombinable): string => {
                return this._combinationService.getCombineClass(tool);
            }
        };
    }

    private updateHighScore = (): void => {
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

    private createHash(value: string): number {
        let hash = 0;

        if (!value || value.length == 0) {
            return hash;
        }

        for (let i = 0; i < value.length; i++) {
            const char = value.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }

        return hash;
    }
}

function canUseInCombat(flagOrFunction: boolean | ((item: IItem, equipment: IEquipment) => boolean), item: IItem, equipment: {}) {
    const canUse = (typeof flagOrFunction === "function") ? flagOrFunction(item, equipment) : flagOrFunction;

    if (canUse && !item.use) {
        console.log(`Item ${item.name} declares it can be used in combat but has no use function.`)
    }

    return canUse;
}
