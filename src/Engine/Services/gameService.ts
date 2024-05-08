import { IRules } from '../Interfaces/rules/rules';
import { IGame } from '../Interfaces/game';
import { IInterfaceTexts } from '../Interfaces/interfaceTexts';
import { ICharacter } from '../Interfaces/character';
import { ISaveGame } from '../Interfaces/saveGame';
import { IEnemy } from '../Interfaces/enemy';
import { IItem } from '../Interfaces/item';
import { IBarrier } from '../Interfaces/barrier';
import { IDestination } from '../Interfaces/destination';
import { ScoreEntry } from '../Interfaces/scoreEntry';
import { IStatistics } from '../Interfaces/statistics';
import { DataKeys } from '../DataKeys';
import { SaveWorldState, getParsedDocument, checkAutoplay, removeItemFromItemsAndEquipment } from './sharedFunctions';
import { DefaultTexts } from '../defaultTexts';
import { IGameService } from '../Interfaces/services//gameService';
import { IDataService } from '../Interfaces/services//dataService';
import { ILocationService } from '../Interfaces/services/locationService';
import { ICharacterService } from '../Interfaces/services/characterService';
import { ICombinationService } from '../Interfaces/services/combinationService';
import { IHelperService } from '../Interfaces/services//helperService';
import { IBarrierAction } from '../Interfaces/barrierAction';
import { GameState } from '../Interfaces/enumerations/gameState';
import { PlayState } from '../Interfaces/enumerations/playState';
import { ICombinable } from '../Interfaces/combinations/combinable';
import { createHash } from '../globals';
import { IFeature } from '../Interfaces/feature';
import { selectStateListEntry } from 'storyScript/utilities';
import { RuntimeProperties } from 'storyScript/runtimeProperties';
import { IParty } from '../Interfaces/party';
import { ICreateCharacter } from '../Interfaces/createCharacter/createCharacter';
import { ICombatSetup } from '../Interfaces/combatSetup';
import { ICombatTurn } from '../Interfaces/combatTurn';

export class GameService implements IGameService {
    private _parsedDescriptions = new Map<string, boolean>();
    private _musicStopped: boolean = false;

    constructor(private _dataService: IDataService, private _locationService: ILocationService, private _characterService: ICharacterService, private _combinationService: ICombinationService, private _rules: IRules, private _helperService: IHelperService, private _game: IGame, private _texts: IInterfaceTexts) {
    }

    init = (restart?: boolean, skipIntro?: boolean): void => {
        this._game.helpers = this._helperService;

        if (restart) {
            this._game.statistics = {};
            this._game.worldProperties = {};
        }

        if (this._rules.setup && this._rules.setup.setupGame) {
            this._rules.setup.setupGame(this._game);
        }

        this.setupGame();
        this.initTexts();
        this._game.highScores = this._dataService.load<ScoreEntry[]>(DataKeys.HIGHSCORES);
        this._game.party = this._dataService.load<IParty>(DataKeys.PARTY);

        if (!restart) {
            this._game.statistics = this._dataService.load<IStatistics>(DataKeys.STATISTICS) || this._game.statistics || {};
            this._game.worldProperties = this._dataService.load(DataKeys.WORLDPROPERTIES) || this._game.worldProperties || {};
        }

        // Use the afterSave hook here to combine the initialized world with other saved data.
        if (this._rules.general?.afterSave) {
            this._rules.general.afterSave(this._game);
        }
        
        if (!this._game.party && this._rules.setup.intro && !skipIntro) {
            this._game.state = GameState.Intro;
            return;
        }
        
        let locationName = this._game.party?.currentLocationId;
        var characterSheet = this._rules.character.getCreateCharacterSheet && this._rules.character.getCreateCharacterSheet();
        var hasCreateCharacterSteps = characterSheet && characterSheet.steps && characterSheet.steps.length > 0;
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
        }
        else {
            this._characterService.setupCharacter();
            this._game.state = GameState.CreateCharacter;
        }
    }

    reset = (): void => {
        this._dataService.remove(DataKeys.WORLD);
        this._dataService.remove(DataKeys.PLAYEDMEDIA);
        this._locationService.init(this._game);
        this._game.worldProperties = this._dataService.load(DataKeys.WORLDPROPERTIES);

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

        this._dataService.save(DataKeys.PARTY, this._game.party);
        this._game.party = this._dataService.load(DataKeys.PARTY);

        if (this._rules.setup.gameStart) {
            this._rules.setup.gameStart(this._game);
        }

        if (!this._game.currentLocation) {
            this._game.changeLocation('Start');
        }

        this.initSetInterceptors();

        this._game.state = GameState.Play;
        this.saveGame();
    }

    levelUp = (character: ICharacter): ICharacter => {
        var levelUpResult = this._characterService.levelUp(character);
        this.saveGame();
        return levelUpResult;
    }

    restart = (skipIntro?: boolean): void => {
        this._dataService.remove(DataKeys.PARTY);
        this._dataService.remove(DataKeys.STATISTICS);
        this._dataService.remove(DataKeys.WORLDPROPERTIES);
        this._dataService.remove(DataKeys.WORLD);
        this._dataService.remove(DataKeys.PLAYEDMEDIA);
        this.init(true, skipIntro);
    }

    saveGame = (name?: string): void => {
        if (name) {
            if (this._rules.general?.beforeSave) {
                this._rules.general.beforeSave(this._game);
            }

            var saveGame = <ISaveGame>{
                name: name,
                party: this._game.party,
                world: this._locationService.copyWorld(),
                worldProperties: this._game.worldProperties,
                statistics: this._game.statistics,
                state: this._game.state
            };

            this._dataService.save(DataKeys.GAME + '_' + name, saveGame);

            if ( this._game.playState === PlayState.Menu) {
                this._game.playState = null;
            }

            if (this._rules.general?.afterSave) {
                this._rules.general.afterSave(this._game);
            }
        }
        else {
            SaveWorldState(this._dataService, this._locationService, this._game, this._rules);
        }
    }

    loadGame = (name: string): void => {
        var saveGame = this._dataService.load<ISaveGame>(DataKeys.GAME + '_' + name);

        if (saveGame) {
            this._game.loading = true;
            this._game.party = saveGame.party;
            this._game.locations = saveGame.world;
            this._game.worldProperties = saveGame.worldProperties;
        
            this._locationService.init(this._game, false);
            this._game.currentLocation = this._game.locations.get(saveGame.party.currentLocationId);

            // Use the afterSave hook here combine the loaded world with other saved data.
            if (this._rules.general?.afterSave) {
                this._rules.general.afterSave(this._game);
            }

            if (saveGame.party.previousLocationId) {
                this._game.previousLocation = this._game.locations.get(saveGame.party.previousLocationId);
            }

            this._game.actionLog = [];
            this._game.state = saveGame.state;

            this.initSetInterceptors();
            
            if ( this._game.playState === PlayState.Menu) {
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
        if (!entity[RuntimeProperties.Description]) {
            return false;
        }

        if (!this._parsedDescriptions.get(entity.id)) {
            var descriptionNode = getParsedDocument(RuntimeProperties.Description, entity[RuntimeProperties.Description])[0];
            this._parsedDescriptions.set(entity.id, descriptionNode?.innerHTML?.trim() !== '');
        }

        return this._parsedDescriptions.get(entity.id);
    }

    initCombat = (): void => {
        if (this._rules.combat && this._rules.combat.initCombat) {
            this._rules.combat.initCombat(this._game, this._game.currentLocation);
        }

        var enemies = this._game.currentLocation.activeEnemies;
        this._game.combat = <ICombatSetup<ICombatTurn>>[];
        this._game.combat.round = 1;

        this._game.party.characters.forEach((c, i) => { 
            const items = c.combatItems ?? [];

            Object.keys(c.equipment).forEach(k => {
                const item = <IItem>c.equipment[k];

                if (item?.useInCombat || item?.isWeapon) {
                    items.push(item)
                }
            });

            this._game.combat[i] = <ICombatTurn>{
                character: c,
                targetsAvailable: enemies,
                target: enemies[0],
                // weaponsAvailable: weapons,
                // weapon: weapons[0],
                // Todo: also sort on name
                itemsAvailable: items.sort((a: IItem, b: IItem) => a.isWeapon ? -1 : 1),
                item: items[0],
                //useWeapon: weapons[0] !== undefined
            };
        });

        this._game.currentLocation.activeEnemies.forEach(enemy => {
            if (enemy.onAttack) {
                enemy.onAttack(this._game);
            }
        });

        this._game.playState = PlayState.Combat;
    }

    fight = (combatRound: ICombatSetup<ICombatTurn>, retaliate?: boolean): Promise<void> | void => {
        if (!this._rules.combat || !this._rules.combat.fight)
        {
            return;
        }

        var promise = this._rules.combat.fight(this._game, combatRound, retaliate);

        return Promise.resolve(promise).then(() => {
            combatRound.forEach((s, i) => {
                if (s.target.hitpoints <= 0) {
                    this.enemyDefeated(this._game.party.characters[i], s.target);
                }
            });

            if (this._game.party.characters.filter(c => c.currentHitpoints >= 0).length == 0) {
                this._game.playState = null;
                this._game.state = GameState.GameOver;
            }

            this.saveGame();
        });
    }

    useItem = (character: ICharacter, item: IItem, target?: IEnemy): Promise<void> | void => {
        var useItem = (this._rules.exploration?.onUseItem && this._rules.exploration.onUseItem(this._game, character, item) && item.use) ?? item.use;

        if (useItem) {
            var promise = item.use(this._game, character, item, target);

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

    executeBarrierAction = (barrier: IBarrier, action: IBarrierAction, destination: IDestination): void => {
        action.execute(this._game, barrier, destination);
        barrier.actions.delete(action);
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
        this._game.sounds.soundQueue.set(createHash(fileName + Math.floor(Math.random() * 1000)), { value: fileName, playing: false, completeCallBack: completeCallBack });
    }

    watchGameState(callBack: (game: IGame, newGameState: GameState, oldGameState: GameState) => void): void {
        this.watchState<GameState>('state', callBack);
    }

    watchPlayState(callBack: (game: IGame, newPlayState: PlayState, oldPlayState: PlayState) => void): void {
        this.watchState<PlayState>('playState', callBack);
    }

    watchState<T>(stateName: string, callBack: (game: IGame, newState: T, oldState: T) => void) {
        var watcherNames = `_${stateName}Watchers`;
        var watchers = this[watcherNames] ?? [];
        this[watcherNames] = watchers;

        if (watchers.length === 0) {
            var state = this._game[stateName];
    
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

    private initTexts = (): void => {
        var defaultTexts = new DefaultTexts();

        for (var n in defaultTexts.texts) {
            this._texts[n] = this._texts[n] ? this._texts[n] : defaultTexts.texts[n];
        }

        this._texts.format = defaultTexts.format;
        this._texts.titleCase = defaultTexts.titleCase;
    }

    private resume = (locationName: string): void => {
        this.initSetInterceptors();

        var lastLocation = this._game.locations.get(locationName) || this._game.locations.get('start');
        var previousLocationName = this._game.party.previousLocationId;

        if (previousLocationName) {
            this._game.previousLocation = this._game.locations.get(previousLocationName);
        }

        this._locationService.changeLocation(lastLocation.id, false, this._game);

        this._game.state = GameState.Play;
    }

    private createCharacter = (characterData : ICreateCharacter): void => {
        this._game.party = this._game.party ?? <IParty>{
            characters: [],
            quests: [],
            score: 0
        };

        var character = this._characterService.createCharacter(this._game, characterData);
        character.items = character.items || [];
        this._game.party.characters.push(character);
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
            var party = this._game.party;
            party.currency = party.currency || 0;
            party.currency += enemy.currency || 0;
        }

        this._game.statistics.enemiesDefeated = this._game.statistics.enemiesDefeated || 0;
        this._game.statistics.enemiesDefeated += 1;
        this._game.currentLocation.enemies.delete(enemy);

        if (this._rules.combat && this._rules.combat.enemyDefeated) {
            this._rules.combat.enemyDefeated(this._game, character, enemy);
        }

        if (enemy.onDefeat) {
            enemy.onDefeat(this._game);
        }
    }

    private setupGame = (): void => {
        this.initLogs();

        Object.defineProperty(this._game, 'activeCharacter', {
            configurable: true,
            get: () => {
                var result = this._game.party.characters.filter(c => c.isActiveCharacter)[0] ?? this._game.party.characters[0];

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
            soundQueue: new Map<number, { value: string, playing: boolean, completeCallBack?: () => void }>
        };

        this.setupCombinations();
        this._locationService.init(this._game);

        this._game.changeLocation = (location, travel) => 
        { 
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
                    this._game.party.characters.forEach((c, i) =>{
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
                    var change = value - currentHitpoints[c.name];
                    currentHitpoints[c.name] = value;

                    if (this._rules.character.hitpointsChange) {
                        this._rules.character.hitpointsChange(this._game, c, change);
                    }
                }
            });
        });

        Object.defineProperty(this._game.party, 'score', {
            configurable: true,
            get: () => {
                return score;
            },
            set: value => {
                var change = value - score;
                score = value;

                // Todo: separate score and xp(?)
                // Change when xp can be lost.
                if (change > 0) {
                    var levelUp = this._rules.general?.scoreChange && this._rules.general.scoreChange(this._game, change);
    
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
            get: () =>
            {
                return gameState;
            },
            set: state => {
                if (state === GameState.GameOver || state === GameState.Victory) {
                    this._game.playState = null;

                    if (this._rules.general?.determineFinalScore) {
                        this._rules.general.determineFinalScore(this._game);
                    }
                    
                    this.updateHighScore();
                    this._dataService.save(DataKeys.HIGHSCORES, this._game.highScores);
                }

                gameState = state;
            }
        });
  
        Object.defineProperty(this._game, 'currentDescription', {
            configurable: true,
            get: () =>
            {
                return currentDescription;
            },
            set: (value: { title: string, type: string, item: IFeature }) => {
                currentDescription = value;

                if (currentDescription.item[RuntimeProperties.Description]) {
                    currentDescription.item[RuntimeProperties.Description] = checkAutoplay(this._dataService, getParsedDocument(RuntimeProperties.Description, currentDescription.item[RuntimeProperties.Description], true)[0].innerHTML);
                }

                this._game.playState = PlayState.Description;
            }
        });
    }

    private initLogs = (): void => {
        this._game.actionLog = [];
        this._game.combatLog = [];

        this._game.logToLocationLog = (message: string) => {
            this._game.currentLocation[RuntimeProperties.Log] = this._game.currentLocation[RuntimeProperties.Log] || [];
            this._game.currentLocation[RuntimeProperties.Log].push(message);
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
                    var result = this._game.combinations.combinationResult;
                    result.done = false;
                    result.text = null;
                    result.featuresToRemove.length = 0;
                }
            },
            activeCombination: null,
            tryCombine: (target: ICombinable): boolean => {
                var activeCombo = this._game.combinations.activeCombination;
                var result = this._combinationService.tryCombination(target);

                if (result.text) {
                    let featuresToRemove: string[] = [];

                    if (result.success) {
                        if (result.removeTarget) {
                            featuresToRemove.push(target.id);
                        }

                        if (result.removeTool) {
                            featuresToRemove.push(activeCombo.selectedTool.id);
                        }
                    }

                    this._game.combinations.combinationResult.featuresToRemove = featuresToRemove;
                    return true;
                }

                return false;
            },
            getCombineClass: (tool: ICombinable): string => {
                return this._combinationService.getCombineClass(tool);
            }
        };
    }

    private updateHighScore = (): void => {
        var scoreEntry = { name: this._game.party.name, score: this._game.party.score };

        if (!this._game.highScores || !this._game.highScores.length) {
            this._game.highScores = [];
        }

        var scoreAdded = false;

        this._game.highScores.forEach((entry) => {
            if (this._game.party.score > entry.score && !scoreAdded) {
                var index = this._game.highScores.indexOf(entry);

                if (this._game.highScores.length >= 5) {
                    this._game.highScores.splice(index, 1, scoreEntry);
                }
                else {
                    this._game.highScores.splice(index, 0, scoreEntry);
                }

                scoreAdded = true;
            }
        });

        if (this._game.highScores.length < 5 && !scoreAdded) {
            this._game.highScores.push(scoreEntry);
        }

        this._dataService.save(DataKeys.HIGHSCORES, this._game.highScores);
    }
}