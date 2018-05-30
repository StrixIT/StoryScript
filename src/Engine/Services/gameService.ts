namespace StoryScript {
    export interface IGameService {
        init(): void;
        initTexts(customTexts: IInterfaceTexts): IInterfaceTexts;
        startNewGame(characterData: any): void;
        reset(): void;
        restart(): void;
        saveGame(name?: string): void;
        getSaveGames(): string[];
        loadGame(name: string): void;
        hasDescription(type: string, item: { id?: string, description?: string }): boolean;
        getDescription(entity: any, key: string): string;
        initCombat(): void;
        fight(enemy: ICompiledEnemy, retaliate?: boolean): void;
        useItem(item: IItem): void;
        executeBarrierAction(destination: IDestination, barrier: IBarrier): void;
        scoreChange(change: number): void;
        hitpointsChange(change: number): void;
        changeGameState(state: StoryScript.GameState): void;
    }
}

namespace StoryScript {
    export class GameService implements IGameService {
        constructor(private _dataService: IDataService, private _locationService: ILocationService, private _characterService: ICharacterService, private _events: EventTarget, private _rules: IRules, private _helperService: IHelperService, private _game: IGame) {
        }

        init = (): void => {
            var self = this;
            self._game.helpers = self._helperService;

            if (self._rules.setupGame) {
                self._rules.setupGame(self._game);
            }

            self.setupGame();

            self._game.highScores = self._dataService.load<ScoreEntry[]>(StoryScript.DataKeys.HIGHSCORES);
            self._game.character = self._dataService.load<ICharacter>(StoryScript.DataKeys.CHARACTER);
            self._game.statistics = self._dataService.load<IStatistics>(StoryScript.DataKeys.STATISTICS) || self._game.statistics || {};
            self._game.worldProperties = self._dataService.load(StoryScript.DataKeys.WORLDPROPERTIES) || self._game.worldProperties || {};

            var locationName = self._dataService.load<string>(StoryScript.DataKeys.LOCATION);

            if (self._game.character && locationName) {
                self.setupCharacter();

                var lastLocation = self._game.locations.get(locationName);
                var previousLocationName = self._dataService.load<string>(StoryScript.DataKeys.PREVIOUSLOCATION);

                if (previousLocationName) {
                    self._game.previousLocation = self._game.locations.get(previousLocationName);
                }

                self._locationService.changeLocation(lastLocation.id, false, self._game);
                self._game.state = StoryScript.GameState.Play;
            }
            else {
                self._game.state = StoryScript.GameState.CreateCharacter;
            }
        }

        initTexts = (customTexts: IInterfaceTexts): IInterfaceTexts => {
            var self = this;
            var defaultTexts = new DefaultTexts();

            for (var n in defaultTexts.texts) {
                customTexts[n] = customTexts[n] ? customTexts[n] : defaultTexts.texts[n];
            }

            customTexts.format = defaultTexts.format;
            customTexts.titleCase = defaultTexts.titleCase;
            return customTexts;
        }

        reset = () => {
            var self = this;
            self._dataService.save(StoryScript.DataKeys.WORLD, {});
            self._locationService.init(self._game);
            self._game.worldProperties = self._dataService.load(StoryScript.DataKeys.WORLDPROPERTIES);
            var location = self._dataService.load<string>(StoryScript.DataKeys.LOCATION);

            if (location) {
                self._locationService.changeLocation(location, false, self._game);
            }
        }

        startNewGame = (characterData: any): void => {
            var self = this;
            self._game.character = self._characterService.createCharacter(self._game, characterData);
            self._dataService.save(StoryScript.DataKeys.CHARACTER, self._game.character);
            self.setupCharacter();
            self._game.changeLocation('Start');
            self._game.state = StoryScript.GameState.Play;
        }

        restart = (): void => {
            var self = this;
            self._dataService.save(StoryScript.DataKeys.CHARACTER, {});
            self._dataService.save(StoryScript.DataKeys.STATISTICS, {});
            self._dataService.save(StoryScript.DataKeys.LOCATION, '');
            self._dataService.save(StoryScript.DataKeys.PREVIOUSLOCATION, '');
            self._dataService.save(StoryScript.DataKeys.WORLDPROPERTIES, {});
            self._dataService.save(StoryScript.DataKeys.WORLD, {});
            self.init();
        }

        saveGame = (name?: string): void => {
            var self = this;

            if (name) {
                var saveGame = <ISaveGame>{
                    name: name,
                    character: self._game.character,
                    world: self._locationService.copyWorld(),
                    worldProperties: self._game.worldProperties,
                    statistics: self._game.statistics,
                    location: self._game.currentLocation.id,
                    previousLocation: self._game.previousLocation ? self._game.previousLocation.id : null,
                    state: self._game.state
                };

                self._dataService.save(StoryScript.DataKeys.GAME + '_' + name, saveGame);
            }
            else {
                self._dataService.save(StoryScript.DataKeys.CHARACTER, self._game.character);
                self._dataService.save(StoryScript.DataKeys.STATISTICS, self._game.statistics);
                self._dataService.save(StoryScript.DataKeys.WORLDPROPERTIES, self._game.worldProperties);
                self._locationService.saveWorld(self._game.locations);
            }
        }

        loadGame = (name: string): void => {
            var self = this;
            var saveGame = self._dataService.load<ISaveGame>(StoryScript.DataKeys.GAME + '_' + name);

            if (saveGame) {
                self._game.loading = true;
                self._game.character = saveGame.character;
                self._game.locations = saveGame.world;
                self._game.worldProperties = saveGame.worldProperties;
            
                self._locationService.init(self._game, false);

                self._game.currentLocation = self._game.locations.get(saveGame.location);

                if (saveGame.previousLocation) {
                    self._game.previousLocation = self._game.locations.get(saveGame.previousLocation);
                }

                self._game.state = saveGame.state;

                setTimeout(() => {
                    var evt = new Event('resourceLoaded');
                    self._events.dispatchEvent(evt);
                }, 0);
            }
        }

        getSaveGames = (): string[] => {
            var self = this;
            return self._dataService.getSaveKeys();
        }

        hasDescription = (type: string, item: { id?: string, description?: string }): boolean => {
            var self = this;
            return self._dataService.hasDescription(type, item);
        }

        getDescription = (entity: any, key: string): string => {
            var self = this;
            var description = entity && entity[key] ? entity[key] : null;

            if (description) {
                self.processAudioTags(entity, key);
            }

            if (self._rules.processDescription) {
                description = self._rules.processDescription(self._game, entity, key);
            }

            return description;
        }

        initCombat = (): void => {
            var self = this;

            if (self._rules.initCombat) {
                self._rules.initCombat(self._game, self._game.currentLocation);
            }

            self._game.currentLocation.activeEnemies.forEach(enemy => {
                if (enemy.onAttack) {
                    enemy.onAttack(self._game);
                }
            });
        }

        fight = (enemy: ICompiledEnemy, retaliate?: boolean) => {
            var self = this;
            self._rules.fight(self._game, enemy, retaliate);

            if (enemy.hitpoints <= 0) {
                if (enemy.items) {
                    enemy.items.forEach((item: IItem) => {
                        self._game.currentLocation.items.push(item);
                    });

                    enemy.items.length = 0;
                }

                self._game.character.currency = self._game.character.currency || 0;
                self._game.character.currency += enemy.currency || 0;

                self._game.statistics.enemiesDefeated = self._game.statistics.enemiesDefeated || 0;
                self._game.statistics.enemiesDefeated += 1;

                self._game.currentLocation.enemies.remove(enemy);

                if (self._rules.enemyDefeated) {
                    self._rules.enemyDefeated(self._game, enemy);
                }

                if (enemy.onDefeat) {
                    enemy.onDefeat(self._game);
                }
            }

            if (self._game.character.currentHitpoints <= 0) {
                self._game.state = StoryScript.GameState.GameOver;
            }

            self.saveGame();
        }

        useItem = (item: IItem): void => {
            var self = this;
            item.use(self._game, item);
        }

        executeBarrierAction = (destination: IDestination, barrier: IBarrier): void => {
            var self = this;

            // Todo: improve, use selected action as object.
            if (!barrier.actions || !barrier.actions.length) {
                return;
            }

            var action = barrier.actions.filter((item: IBarrier) => { return item.name == barrier.selectedAction.name; })[0];
            action.action(self._game, destination, barrier, action);
            barrier.actions.remove(action);

            if (barrier.actions.length) {
                barrier.selectedAction = barrier.actions[0];
            }

            self.saveGame();
        }

        scoreChange = (change: number): void => {
            var self = this;

            // Todo: change if xp can be lost.
            if (change > 0) {
                var character = self._game.character;
                var levelUp = self._rules.scoreChange(self._game, change);

                if (levelUp) {
                    self._game.state = StoryScript.GameState.LevelUp;
                }
            }
        }

        hitpointsChange = (change: number): void => {
            var self = this;

            if (self._rules.hitpointsChange) {
                self._rules.hitpointsChange(self._game, change);
            }
        }

        changeGameState = (state: StoryScript.GameState) => {
            var self = this;

            if (state == StoryScript.GameState.GameOver || state == StoryScript.GameState.Victory) {
                if (self._rules.determineFinalScore) {
                    self._rules.determineFinalScore(self._game);
                }
                self.updateHighScore();
                self._dataService.save(StoryScript.DataKeys.HIGHSCORES, self._game.highScores);
            }
        }

        private setupGame(): void {
            var self = this;
            self._game.actionLog = [];
            self._game.combatLog = [];

            self._game.logToLocationLog = (message: string) => {
                self._game.currentLocation.log = self._game.currentLocation.log || [];
                self._game.currentLocation.log.push(message);
            }

            self._game.logToActionLog = (message: string) => {
                self._game.actionLog.splice(0, 0, message);
            }

            self._game.logToCombatLog = (message: string) => {
                self._game.combatLog.splice(0, 0, message);
            }

            self._game.fight = self.fight;

            // Add a string variant of the game state so the string representation can be used in HTML instead of a number.
            if (!(<any>self._game).stateString) {
                Object.defineProperty(self._game, 'stateString', {
                    enumerable: true,
                    get: function () {
                        return GameState[self._game.state];
                    }
                });
            }

            self._locationService.init(self._game);
        }

        private setupCharacter(): void {
            var self = this;

            createReadOnlyCollection(self._game.character, 'items', isEmpty(self._game.character.items) ? [] : <any>self._game.character.items);
            createReadOnlyCollection(self._game.character, 'quests', isEmpty(self._game.character.quests) ? [] : <any>self._game.character.quests);

            addProxy(self._game.character, 'item', self._game, self._rules);

            Object.defineProperty(self._game.character, 'combatItems', {
                get: function () {
                    return self._game.character.items.filter(e => { return e.useInCombat; });
                }
            });
        }

        private processAudioTags(parent: any, key: string, newOnly?: boolean) {
            var self = this;
            var description = parent[key] as string;
            var descriptionEntry = parent;
            var descriptionKey = key;
    
            // For locations, the descriptions collection must be updated as well as the text.
            if (parent === self._game.currentLocation) {
                var location = self._game.currentLocation;
                descriptionEntry = location.descriptions;
    
                for (let n in location.descriptions) {
                    if (location.descriptions[n] === location.text) {
                        descriptionKey = n;
                        break;
                    }
                }
            }

            if (descriptionKey !== key) {
                self.updateAudioTags(descriptionEntry, descriptionKey, 'autoplay="autoplay"', '');
            }

            var startPlay = self.updateAudioTags(parent, key, 'autoplay="autoplay"', 'added="added"');
    
            if (startPlay)
            {
                setTimeout(function () {
                    var audioElements = document.getElementsByTagName('audio');
    
                    for (var i = 0; i < audioElements.length; i++) {
                        var element = (<HTMLAudioElement>audioElements[i]);
                        var added = element.getAttribute('added');
    
                        if (element.play && added === 'added') {
                            self.updateAudioTags(parent, key, 'added="added"', '');
                            element.play();
                        }
                    }
                }, 0);
            }
        }

        private updateAudioTags(entity: any, key: string, tagToFind: string, tagToReplace: string): boolean {
            let startPlay = false;

            if (entity[key]) {
                if (entity[key].indexOf(tagToFind) > -1) {
                    entity[key] = entity[key].replace(tagToFind, tagToReplace);
                    startPlay = true;
                }
            }

            return startPlay;
        }

        private updateHighScore(): void {
            var self = this;

            var scoreEntry = { name: self._game.character.name, score: self._game.character.score };

            if (!self._game.highScores || !self._game.highScores.length) {
                self._game.highScores = [];
            }

            var scoreAdded = false;

            self._game.highScores.forEach((entry) => {
                if (self._game.character.score > entry.score && !scoreAdded) {
                    var index = self._game.highScores.indexOf(entry);

                    if (self._game.highScores.length >= 5) {
                        self._game.highScores.splice(index, 1, scoreEntry);
                    }
                    else {
                        self._game.highScores.splice(index, 0, scoreEntry);
                    }

                    scoreAdded = true;
                }
            });

            if (self._game.highScores.length < 5 && !scoreAdded) {
                self._game.highScores.push(scoreEntry);
            }

            self._dataService.save(StoryScript.DataKeys.HIGHSCORES, self._game.highScores);
        }

        private setStartNode(person: ICompiledPerson, nodeName: string): void {
            var node = person.conversation.nodes.filter(n => n.node === nodeName)[0];

            if (node == null) {
                console.log("Cannot set conversation start node to node " + nodeName + ". A node with this name is not defined.");
                return;
            }

            node.start = true;
        }
    }
}