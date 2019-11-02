namespace StoryScript {
    export interface IGameService {
        init(): void;
        startNewGame(characterData: any): void;
        levelUp(sheet: ICreateCharacter): ICharacter;
        reset(): void;
        restart(skipIntro?: boolean): void;
        saveGame(name?: string): void;
        getSaveGames(): string[];
        loadGame(name: string): void;
        hasDescription(type: string, item: { id?: string, description?: string }): boolean;
        getDescription(type: string, entity: any, key: string): string;
        setCurrentDescription(type: string, entity: any, key: string): void;
        initCombat(): void;
        fight(enemy: IEnemy, retaliate?: boolean): void;
        useItem(item: IItem): void;
        executeBarrierAction(barrier: IBarrier, destination: IDestination): void;
        getCurrentMusic(): string;
    }
}

namespace StoryScript {
    export class GameService implements IGameService {
        private mediaTags = ['autoplay="autoplay"', 'autoplay=""', 'autoplay'];
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
            this._game.highScores = this._dataService.load<ScoreEntry[]>(StoryScript.DataKeys.HIGHSCORES);
            this._game.character = this._dataService.load<ICharacter>(StoryScript.DataKeys.CHARACTER);

            if (!restart) {
                this._game.statistics = this._dataService.load<IStatistics>(StoryScript.DataKeys.STATISTICS) || this._game.statistics || {};
                this._game.worldProperties = this._dataService.load(StoryScript.DataKeys.WORLDPROPERTIES) || this._game.worldProperties || {};
            }
            
            if (!this._game.character && this._rules.setup.intro && !skipIntro) {
                this._game.state = GameState.Intro;
                return;
            }
            
            var locationName = this._dataService.load<string>(StoryScript.DataKeys.LOCATION);
            var characterSheet = this._rules.character.getCreateCharacterSheet && this._rules.character.getCreateCharacterSheet();
            var hasCreateCharacterSteps = characterSheet && characterSheet.steps && characterSheet.steps.length > 0;

            if (!hasCreateCharacterSteps && !this._game.character) {
                this.createCharacter(<ICharacter>{});
                locationName = 'Start';
            }

            if (this._game.character && locationName) {
                this.initSetInterceptors();
                this.resume(locationName);
            }
            else {
                this._characterService.setupCharacter();
                this._game.state = GameState.CreateCharacter;
            }
        }

        reset = (): void => {
            this._dataService.save(StoryScript.DataKeys.WORLD, {});
            this._locationService.init(this._game);
            this._game.worldProperties = this._dataService.load(StoryScript.DataKeys.WORLDPROPERTIES);
            var location = this._dataService.load<string>(StoryScript.DataKeys.LOCATION);

            if (location) {
                this._locationService.changeLocation(location, false, this._game);
            }
        }

        startNewGame = (characterData: any): void => {
            this.createCharacter(characterData);

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

        levelUp = (sheet: ICreateCharacter): ICharacter => {
            var levelUpResult = this._characterService.levelUp(this._game, sheet);
            this.saveGame();
            return levelUpResult;
        }

        restart = (skipIntro?: boolean): void => {
            this._dataService.save(StoryScript.DataKeys.CHARACTER, {});
            this._dataService.save(StoryScript.DataKeys.STATISTICS, {});
            this._dataService.save(StoryScript.DataKeys.LOCATION, '');
            this._dataService.save(StoryScript.DataKeys.PREVIOUSLOCATION, '');
            this._dataService.save(StoryScript.DataKeys.WORLDPROPERTIES, {});
            this._dataService.save(StoryScript.DataKeys.WORLD, {});
            this.init(true, skipIntro);
        }

        saveGame = (name?: string): void => {
            if (name) {
                var saveGame = <ISaveGame>{
                    name: name,
                    character: this._game.character,
                    world: this._locationService.copyWorld(),
                    worldProperties: this._game.worldProperties,
                    statistics: this._game.statistics,
                    location: this._game.currentLocation && this._game.currentLocation.id,
                    previousLocation: this._game.previousLocation ? this._game.previousLocation.id : null,
                    state: this._game.state
                };

                this._dataService.save(StoryScript.DataKeys.GAME + '_' + name, saveGame);

                if ( this._game.playState === PlayState.Menu) {
                    this._game.playState = null;
                }
            }
            else {
                SaveWorldState(this._dataService, this._locationService, this._game);
            }
        }

        loadGame = (name: string): void => {
            var saveGame = this._dataService.load<ISaveGame>(StoryScript.DataKeys.GAME + '_' + name);

            if (saveGame) {
                this._game.loading = true;
                this._game.character = saveGame.character;
                this._game.locations = saveGame.world;
                this._game.worldProperties = saveGame.worldProperties;
            
                this._locationService.init(this._game, false);
                this._game.currentLocation = this._game.locations.get(saveGame.location);

                if (saveGame.previousLocation) {
                    this._game.previousLocation = this._game.locations.get(saveGame.previousLocation);
                }

                SaveWorldState(this._dataService, this._locationService, this._game);
                this._dataService.save(StoryScript.DataKeys.LOCATION, this._game.currentLocation.id);
                this._game.actionLog = [];
                this._game.state = saveGame.state;

                this.initSetInterceptors();
                
                if ( this._game.playState === PlayState.Menu) {
                    this._game.playState = null;
                }

                this._game.combinations.combinationResult.reset(); 

                setTimeout(() => {
                    this._game.loading = false;
                }, 0);
            }
        }

        getSaveGames = (): string[] => this._dataService.getSaveKeys();

        hasDescription = (type: string, item: { id?: string, description?: string }): boolean => this._dataService.hasDescription(type, item);

        getDescription = (type: string, entity: any, key: string): string => {
            var description = entity && entity[key] ? entity[key] : null;

            if (!description) {
                this._dataService.loadDescription(type, entity);
                description = entity[key];
            }

            if (description) {
                this.processMediaTags(entity, key);
            }

            return description;
        }

        setCurrentDescription = (type: string, item: any, title: string): void => {
            if (item.description === undefined || item.description === null) {
                item.description = this.getDescription(type, item, 'description');
            }

            this._game.currentDescription = {
                title: title,
                type: type, 
                item: item
            };
        }

        initCombat = (): void => {
            if (this._rules.combat && this._rules.combat.initCombat) {
                this._rules.combat.initCombat(this._game, this._game.currentLocation);
            }

            this._game.currentLocation.activeEnemies.forEach(enemy => {
                if (enemy.onAttack) {
                    enemy.onAttack(this._game);
                }
            });
        }

        fight = (enemy: IEnemy, retaliate?: boolean) => {
            if (!this._rules.combat || !this._rules.combat.fight)
            {
                return;
            }

            this._rules.combat.fight(this._game, enemy, retaliate);

            if (enemy.hitpoints <= 0) {
                this.enemyDefeated(enemy);
            }

            if (this._game.character.currentHitpoints <= 0) {
                this._game.playState = null;
                this._game.state = GameState.GameOver;
            }

            this.saveGame();
        }

        useItem = (item: IItem): void => item.use(this._game, item);

        executeBarrierAction = (barrier: IBarrier, destination: IDestination, ): void => {
            if (isEmpty(barrier.actions)) {
                return;
            }

            var actionIndex = barrier.actions.indexOf(barrier.selectedAction);
            barrier.selectedAction.execute(this._game, barrier, destination);
            barrier.actions.splice(actionIndex, 1);

            if (barrier.actions.length) {
                barrier.selectedAction = barrier.actions[0];
            }

            this.saveGame();
        }

        getCurrentMusic = (): string => {
            var currentEntry = !this._musicStopped && this._rules.setup.playList && this._rules.setup.playList.filter(e => this._game.playState ? e[0] === this._game.playState : e[0] === this._game.state)[0];
            return currentEntry && <string>currentEntry[1];
        }

        startMusic = (): boolean => this._musicStopped = false;

        stopMusic = (): boolean => this._musicStopped = true;

        private initTexts = (): void => {
            var defaultTexts = new DefaultTexts();

            for (var n in defaultTexts.texts) {
                this._texts[n] = this._texts[n] ? this._texts[n] : defaultTexts.texts[n];
            }

            this._texts.format = defaultTexts.format;
            this._texts.titleCase = defaultTexts.titleCase;
        }

        private resume = (locationName: string): void => {
            var lastLocation = this._game.locations.get(locationName) || this._game.locations.get('start');
            var previousLocationName = this._dataService.load<string>(StoryScript.DataKeys.PREVIOUSLOCATION);

            if (previousLocationName) {
                this._game.previousLocation = this._game.locations.get(previousLocationName);
            }

            // Reset loading descriptions so changes to the descriptions are shown right away instead of requiring a world reset.
            this.resetLoadedHtml(this._game.locations);
            this.resetLoadedHtml(this._game.character);

            this._locationService.changeLocation(lastLocation.id, false, this._game);

            this._game.state = GameState.Play;
        }

        private createCharacter = (characterData : ICharacter): void => {
            var character = this._characterService.createCharacter(this._game, characterData);
            character.items = character.items || [];
            character.quests = character.quests || [];
            this._dataService.save(StoryScript.DataKeys.CHARACTER, character);
            this._game.character = this._dataService.load(StoryScript.DataKeys.CHARACTER);
        }

        private enemyDefeated = (enemy: IEnemy): void => {
            if (enemy.items) {
                enemy.items.forEach((item: IItem) => {
                    this._game.currentLocation.items.push(item);
                });

                enemy.items.length = 0;
            }

            this._game.character.currency = this._game.character.currency || 0;
            this._game.character.currency += enemy.currency || 0;
            this._game.statistics.enemiesDefeated = this._game.statistics.enemiesDefeated || 0;
            this._game.statistics.enemiesDefeated += 1;
            this._game.currentLocation.enemies.remove(enemy);

            if (this._rules.combat && this._rules.combat.enemyDefeated) {
                this._rules.combat.enemyDefeated(this._game, enemy);
            }

            if (enemy.onDefeat) {
                enemy.onDefeat(this._game);
            }
        }

        private setupGame = (): void => {
            this.initLogs();
            this._game.fight = this.fight;
            this._game.sounds = { 
                startMusic: this.startMusic,
                stopMusic: this.stopMusic
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
        }

        private initSetInterceptors = (): void => {
            let currentHitpoints = this._game.character.currentHitpoints || this._game.character.hitpoints;
            let score = this._game.character.score || 0;
            let gameState = this._game.state;

            Object.defineProperty(this._game.character, 'currentHitpoints', {
                get: () => {
                    return currentHitpoints;
                },
                set: value => {
                    var change = value - currentHitpoints;
                    currentHitpoints = value;

                    if (this._rules.character.hitpointsChange) {
                        this._rules.character.hitpointsChange(this._game, change);
                    }
                }
            });

            if (!this._game.character.score) {
                Object.defineProperty(this._game.character, 'score', {
                    get: () => {
                        return score;
                    },
                    set: value => {
                        var change = value - score;
                        score = value;

                        // Change when xp can be lost.
                        if (change > 0) {
                            var levelUp = this._rules.general && this._rules.general.scoreChange && this._rules.general.scoreChange(this._game, change);
            
                            if (levelUp) {
                                this._game.state = GameState.LevelUp;
                            }
                        }
                    }
                });
            }
     
            if (!this._game.state) {
                Object.defineProperty(this._game, 'state', {
                    get: () =>
                    {
                        return gameState;
                    },
                    set: state => {
                        if (state === GameState.GameOver || state === GameState.Victory) {
                            this._game.playState = null;

                            if (this._rules.general && this._rules.general.determineFinalScore) {
                                this._rules.general.determineFinalScore(this._game);
                            }
                            
                            this.updateHighScore();
                            this._dataService.save(StoryScript.DataKeys.HIGHSCORES, this._game.highScores);
                        }

                        gameState = state;
                    }
                });
            }
        }

        private initLogs = (): void => {
            this._game.actionLog = [];
            this._game.combatLog = [];

            this._game.logToLocationLog = (message: string) => {
                this._game.currentLocation.log = this._game.currentLocation.log || [];
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

        private resetLoadedHtml = (entity: any): void => {
            if (entity === null) {
                return;
            }

            if (entity.hasHtmlDescription) {
                if (entity.descriptions) {
                    entity.descriptions = null;
                    entity.text = null;
                }
                
                if (entity.description) {
                    entity.description = null;
                }

                if (entity.conversation && entity.conversation.nodes) {
                    entity.conversation.nodes = null;
                }
            }

            for (var i in Object.keys(entity))
            {
                var key = Object.keys(entity)[i];

                if (entity.hasOwnProperty(key)) {
                    var nestedEntity = entity[key];

                    if (typeof nestedEntity === 'object') {
                        this.resetLoadedHtml(entity[key]);
                    }
                }
            }
        }

        private processMediaTags = (parent: any, key: string): void => {
            var descriptionEntry = parent;
            var descriptionKey = key;
    
            // For locations, the descriptions collection must be updated as well as the text.
            if (parent === this._game.currentLocation) {
                var location = this._game.currentLocation;
                descriptionEntry = location.descriptions;
    
                for (let n in location.descriptions) {
                    if (location.descriptions[n] === location.text) {
                        descriptionKey = n;
                        break;
                    }
                }
            }

            if (descriptionKey !== key) {
                this.updateMediaTags(descriptionEntry, descriptionKey, this.mediaTags, '');
            }

            var startPlay = this.updateMediaTags(parent, key, this.mediaTags, 'added="added"');

            if (startPlay)
            {
                this.startPlay('audio', parent, key);
                this.startPlay('video', parent, key);
            }
        }

        private startPlay = (type: string, parent: any, key: string): void => {
            setTimeout(function () {
                var mediaElements = document.getElementsByTagName(type);

                for (var i = 0; i < mediaElements.length; i++) {
                    var element = <HTMLMediaElement>mediaElements[i];
                    var added = element.getAttribute('added');

                    if (element.play && added === 'added') {
                        var loop = element.getAttribute('loop');

                        if (loop != null) {
                            this.updateMediaTags(parent, key, ['added="added"'], 'autoplay');
                        }
                        else {
                            this.updateMediaTags(parent, key, ['added="added"'], '');
                        }

                        // Chrome will block autoplay when the user hasn't interacted with the page yet, use this workaround to bypass that.
                        const playPromise = element.play();

                        if (playPromise !== null) {
                            playPromise.catch(() => { 
                                setTimeout(function () {
                                    element.play(); 
                                }, 1000);
                            });
                        }
                    }
                }
            }, 0);
        }

        private updateMediaTags = (entity: any, key: string, tagToFind: string[], tagToReplace: string): boolean => {
            let startPlay = false;
            var entry = entity[key];

            if (entry) {
                for (var i in tagToFind)
                {
                    var tag = tagToFind[i];

                    if (entry.indexOf(tag) > -1) {
                        entity[key] = entry.replace(tag, tagToReplace);
                        startPlay = true;
                    }
                }
            }

            return startPlay;
        }

        private updateHighScore = (): void => {
            var scoreEntry = { name: this._game.character.name, score: this._game.character.score };

            if (!this._game.highScores || !this._game.highScores.length) {
                this._game.highScores = [];
            }

            var scoreAdded = false;

            this._game.highScores.forEach((entry) => {
                if (this._game.character.score > entry.score && !scoreAdded) {
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

            this._dataService.save(StoryScript.DataKeys.HIGHSCORES, this._game.highScores);
        }
    }
}