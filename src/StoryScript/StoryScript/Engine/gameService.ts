module StoryScript {
    export interface IGameService {
        init(): void;
        startNewGame(characterData: any): void;
        reset(): void;
        restart(): void;
        saveGame(): void;
        fight(enemy: ICompiledEnemy, retaliate?: boolean): void;
        scoreChange(change: number): void;
        hitpointsChange(change: number): void;
        changeGameState(state: StoryScript.GameState): void;
    }
}

module StoryScript {
    export class GameService implements ng.IServiceProvider, IGameService {
        private $timeout: ng.ITimeoutService;
        private dataService: IDataService;
        private locationService: ILocationService;
        private characterService: ICharacterService;
        private rules: IRules;
        private helperService: IHelperService;
        private game: IGame;
        private gameNameSpace: string;
        private definitions: IDefinitions;

        constructor($timeout: ng.ITimeoutService, dataService: IDataService, locationService: ILocationService, characterService: ICharacterService, rules: IRules, helperService: IHelperService, game: IGame) {
            var self = this;
            self.$timeout = $timeout;
            self.dataService = dataService;
            self.locationService = locationService;
            self.characterService = characterService;
            self.rules = rules;
            self.helperService = helperService;
            self.game = game;
        }

        public $get($timeout: ng.ITimeoutService, dataService: IDataService, locationService: ILocationService, characterService: ICharacterService, rules: IRules, helperService: IHelperService, game: IGame): IGameService {
            var self = this;
            self.$timeout = $timeout;
            self.dataService = dataService;
            self.locationService = locationService;
            self.characterService = characterService;
            self.rules = rules;
            self.helperService = helperService;
            self.game = game;

            return {
                init: self.init,
                startNewGame: self.startNewGame,
                reset: self.reset,
                restart: self.restart,
                saveGame: self.saveGame,
                fight: self.fight,
                hitpointsChange: self.hitpointsChange,
                scoreChange: self.scoreChange,
                changeGameState: self.changeGameState
            };
        }

        init = (): void => {
            var self = this;
            self.game.helpers = self.helperService;

            if (self.rules.setupGame) {
                self.rules.setupGame(self.game);
            }

            self.setupGame();

            self.game.highScores = self.dataService.load<ScoreEntry[]>(StoryScript.DataKeys.HIGHSCORES);
            self.game.character = self.dataService.load<ICharacter>(StoryScript.DataKeys.CHARACTER);
            self.game.statistics = self.dataService.load<IStatistics>(StoryScript.DataKeys.STATISTICS) || {};
            self.game.worldProperties = self.dataService.load(StoryScript.DataKeys.WORLDPROPERTIES) || {};

            var locationName = self.dataService.load<string>(StoryScript.DataKeys.LOCATION);

            if (self.game.character && locationName) {
                self.setupCharacter();

                var lastLocation = self.game.locations.get(locationName);
                var previousLocationName = self.dataService.load<string>(StoryScript.DataKeys.PREVIOUSLOCATION);

                if (previousLocationName) {
                    self.game.previousLocation = self.game.locations.get(previousLocationName);
                }

                self.locationService.changeLocation(lastLocation.id, false, self.game);
                self.game.state = StoryScript.GameState.Play;
            }
            else {
                self.game.state = StoryScript.GameState.CreateCharacter;
            }
        }

        reset = () => {
            var self = this;
            self.dataService.save(StoryScript.DataKeys.WORLD, {});
            self.locationService.init(self.game);
            self.setupLocations();
            self.game.worldProperties = self.dataService.load(StoryScript.DataKeys.WORLDPROPERTIES);
            var location = self.dataService.load<string>(StoryScript.DataKeys.LOCATION);

            if (location) {
                self.locationService.changeLocation(location, false, self.game);
            }
        }

        startNewGame = (characterData: any): void => {
            var self = this;
            self.game.character = self.characterService.createCharacter(self.game, characterData);
            self.dataService.save(StoryScript.DataKeys.CHARACTER, self.game.character);
            self.setupCharacter();
            self.game.changeLocation('Start');
        }

        restart = (): void => {
            var self = this;
            self.dataService.save(StoryScript.DataKeys.CHARACTER, {});
            self.dataService.save(StoryScript.DataKeys.STATISTICS, {});
            self.dataService.save(StoryScript.DataKeys.LOCATION, '');
            self.dataService.save(StoryScript.DataKeys.PREVIOUSLOCATION, '');
            self.dataService.save(StoryScript.DataKeys.WORLDPROPERTIES, {});
            self.dataService.save(StoryScript.DataKeys.WORLD, {});
            self.init();
        }

        saveGame = (): void => {
            var self = this;
            self.dataService.save(StoryScript.DataKeys.CHARACTER, self.game.character);
            self.dataService.save(StoryScript.DataKeys.STATISTICS, self.game.statistics);
            self.dataService.save(StoryScript.DataKeys.WORLDPROPERTIES, self.game.worldProperties);
            self.locationService.saveWorld(self.game.locations);
        }

        fight = (enemy: ICompiledEnemy, retaliate?: boolean) => {
            var self = this;
            self.rules.fight(self.game, enemy, retaliate);

            if (enemy.hitpoints <= 0) {
                if (enemy.items) {
                    enemy.items.forEach((item: IItem) => {
                        self.game.currentLocation.items.push(item);
                    });

                    enemy.items.length = 0;
                }

                self.game.character.currency = self.game.character.currency || 0;
                self.game.character.currency += enemy.currency || 0;

                self.game.statistics.enemiesDefeated = self.game.statistics.enemiesDefeated || 0;
                self.game.statistics.enemiesDefeated += 1;

                self.game.currentLocation.enemies.remove(enemy);

                if (self.rules.enemyDefeated) {
                    self.rules.enemyDefeated(self.game, enemy);
                }

                if (enemy.onDefeat) {
                    enemy.onDefeat(self.game);
                }
            }

            if (self.game.character.currentHitpoints <= 0) {
                self.game.state = StoryScript.GameState.GameOver;
            }
        }

        scoreChange = (change: number): void => {
            var self = this;

            // Todo: change if xp can be lost.
            if (change > 0) {
                var character = self.game.character;
                var levelUp = self.rules.scoreChange(self.game, change);

                if (levelUp) {
                    // Need a timeout here to prevent the change location game state change to 'play' to fire right after this one
                    // when the score increases when moving from one location to the other and immediately changing the state back
                    // to play.
                    self.$timeout(() => {
                        self.game.state = StoryScript.GameState.LevelUp;
                    }, 0);
                }
            }
        }

        hitpointsChange = (change: number): void => {
            var self = this;

            if (self.rules.hitpointsChange) {
                self.rules.hitpointsChange(self.game, change);
            }
        }

        changeGameState = (state: StoryScript.GameState) => {
            var self = this;

            if (state == StoryScript.GameState.GameOver || state == StoryScript.GameState.Victory) {
                if (self.rules.determineFinalScore) {
                    self.rules.determineFinalScore(self.game);
                }
                self.updateHighScore();
                self.dataService.save(StoryScript.DataKeys.HIGHSCORES, self.game.highScores);
            }
        }

        private setupGame(): void {
            var self = this;
            self.game.actionLog = [];
            self.game.combatLog = [];

            self.game.logToLocationLog = (message: string) => {
                self.game.currentLocation.log = self.game.currentLocation.log || [];
                self.game.currentLocation.log.push(message);
            }

            self.game.logToActionLog = (message: string) => {
                self.game.actionLog.splice(0, 0, message);
            }

            self.game.logToCombatLog = (message: string) => {
                self.game.combatLog.splice(0, 0, message);
            }

            self.game.fight = self.fight;

            // Add a string variant of the game state so the string representation can be used in HTML instead of a number.
            if (!(<any>self.game).stateString) {
                Object.defineProperty(self.game, 'stateString', {
                    enumerable: true,
                    get: function () {
                        return GameState[self.game.state];
                    }
                });
            }

            self.locationService.init(self.game);

            self.setupLocations();
        }

        private setupCharacter(): void {
            var self = this;

            createReadOnlyCollection(self.game.character, 'items', isEmpty(self.game.character.items) ? [] : self.game.character.items);
            createReadOnlyCollection(self.game.character, 'quests', isEmpty(self.game.character.quests) ? [] : self.game.character.quests);

            addProxy(self.game.character, 'item', self.game, self.rules);

            Object.defineProperty(self.game.character, 'combatItems', {
                get: function () {
                    return self.game.character.items.filter(e => { return e.useInCombat; });
                }
            });
        }

        private setupLocations(): void {
            var self = this;

            self.game.locations.forEach((location: ICompiledLocation) => {
                addProxy(location, 'enemy', self.game, self.rules);
            });
        }

        private updateHighScore(): void {
            var self = this;

            var scoreEntry = { name: self.game.character.name, score: self.game.character.score };

            if (!self.game.highScores || !self.game.highScores.length) {
                self.game.highScores = [];
            }

            var scoreAdded = false;

            self.game.highScores.forEach((entry) => {
                if (self.game.character.score > entry.score && !scoreAdded) {
                    var index = self.game.highScores.indexOf(entry);

                    if (self.game.highScores.length >= 5) {
                        self.game.highScores.splice(index, 1, scoreEntry);
                    }
                    else {
                        self.game.highScores.splice(index, 0, scoreEntry);
                    }

                    scoreAdded = true;
                }
            });

            if (self.game.highScores.length < 5 && !scoreAdded) {
                self.game.highScores.push(scoreEntry);
            }

            self.dataService.save(StoryScript.DataKeys.HIGHSCORES, self.game.highScores);
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

    GameService.$inject = ['$timeout', 'dataService', 'locationService', 'characterService', 'rules', 'helperService', 'game'];
}