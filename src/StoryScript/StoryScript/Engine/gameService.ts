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
        private dataService: IDataService;
        private locationService: ILocationService;
        private characterService: ICharacterService;
        private ruleService: IRuleService;
        private game: IGame;
        private gameNameSpace: string;
        private definitions: IDefinitions;

        constructor(dataService: IDataService, locationService: ILocationService, characterService: ICharacterService, ruleService: IRuleService, game: IGame, gameNameSpace: string, definitions: IDefinitions) {
            var self = this;
            self.dataService = dataService;
            self.locationService = locationService;
            self.characterService = characterService;
            self.ruleService = ruleService;
            self.game = game;
            self.gameNameSpace = gameNameSpace;
            self.definitions = definitions;
        }

        public $get(dataService: IDataService, locationService: ILocationService, characterService: ICharacterService, ruleService: IRuleService, game: IGame, gameNameSpace: string, definitions: IDefinitions): IGameService {
            var self = this;
            self.dataService = dataService;
            self.locationService = locationService;
            self.characterService = characterService;
            self.ruleService = ruleService;
            self.game = game;
            self.gameNameSpace = gameNameSpace;
            self.definitions = definitions;

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
            self.game.nameSpace = self.gameNameSpace;

            self.getDefinitions();

            if (self.ruleService.setupGame) {
                self.ruleService.setupGame(self.game);
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
            self.game.character = self.characterService.createCharacter(characterData);
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
            self.ruleService.fight(enemy, retaliate);

            if (enemy.hitpoints <= 0) {
                if (enemy.items) {
                    enemy.items.forEach((item: IItem) => {
                        self.game.currentLocation.items = self.game.currentLocation.items || [];
                        self.game.currentLocation.items.push(item);
                    });

                    enemy.items = <[IItem]>[];
                }

                self.game.character.currency = self.game.character.currency || 0;
                self.game.character.currency += enemy.currency || 0;

                self.game.statistics.enemiesDefeated = self.game.statistics.enemiesDefeated || 0;
                self.game.statistics.enemiesDefeated += 1;

                self.game.currentLocation.enemies.remove(enemy);

                if (self.ruleService.enemyDefeated) {
                    self.ruleService.enemyDefeated(enemy);
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
                var levelUp = self.ruleService.scoreChange(change);

                if (levelUp) {
                    self.game.state = StoryScript.GameState.LevelUp;
                }
            }
        }

        hitpointsChange = (change: number): void => {
            var self = this;

            if (self.ruleService.hitpointsChange) {
                self.ruleService.hitpointsChange(change);
            }
        }

        changeGameState = (state: StoryScript.GameState) => {
            var self = this;

            if (state == StoryScript.GameState.GameOver || state == StoryScript.GameState.Victory) {
                if (self.ruleService.determineFinalScore) {
                    self.ruleService.determineFinalScore();
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

            self.game.getEnemy = (selector: string | (() => IEnemy)): ICompiledEnemy => {
                var instance = StoryScript.find<IEnemy>(self.game.definitions.enemies, selector);
                return self.instantiateEnemy(instance);
            }

            self.game.getItem = (selector: string | (() => IItem)) => {
                return StoryScript.find<IItem>(self.game.definitions.items, selector);
            }

            self.game.getPerson = (selector: string | (() => IPerson)): ICompiledPerson => {
                var instance = StoryScript.find<IPerson>(self.game.definitions.persons, selector);
                return self.instantiatePerson(instance);
            }

            self.game.randomEnemy = (selector?: (enemy: IEnemy) => boolean): ICompiledEnemy => {
                var instance = StoryScript.random<IEnemy>(self.game.definitions.enemies, <(enemy: IEnemy) => boolean>selector);
                return self.instantiateEnemy(instance);
            }

            self.game.randomItem = (selector?: string | (() => IItem) | ((item: IItem) => boolean)): IItem => {
                return StoryScript.random<IItem>(self.game.definitions.items, <(item: IItem) => boolean>selector);
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

            self.addProxy(self.game.character, 'item');

            Object.defineProperty(self.game.character, 'combatItems', {
                get: function () {
                    return self.game.character.items.filter(e => { return e.useInCombat; });
                }
            });
        }

        private setupLocations(): void {
            var self = this;

            self.game.locations.forEach((location: ICompiledLocation) => {
                self.addProxy(location, 'enemy');
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

        private getDefinitions() {
            var self = this;
            var nameSpaceObject = window[self.gameNameSpace];

            self.definitions.locations = <[() => ILocation]>[];
            self.moveObjectPropertiesToArray(nameSpaceObject['Locations'], self.definitions.locations);

            self.definitions.enemies = <[() => IEnemy]>[];
            self.moveObjectPropertiesToArray(nameSpaceObject['Enemies'], self.definitions.enemies);

            self.definitions.persons = <[() => IPerson]>[];
            self.moveObjectPropertiesToArray(nameSpaceObject['Persons'], self.definitions.persons);

            self.definitions.items = <[() => IItem]>[];
            self.moveObjectPropertiesToArray(nameSpaceObject['Items'], self.definitions.items);

            self.definitions.quests = <[() => IQuest]>[];
            self.moveObjectPropertiesToArray(nameSpaceObject['Quests'], self.definitions.quests);

            self.definitions.actions = <[() => IAction]>[];
            self.moveObjectPropertiesToArray(window['StoryScript']['Actions'], self.definitions.actions);
            self.moveObjectPropertiesToArray(nameSpaceObject['Actions'], self.definitions.actions);

            self.game.definitions = self.definitions;
        }

        private moveObjectPropertiesToArray<T>(object: {}, collection: [() => T]) {
            for (var n in object) {
                if (object.hasOwnProperty(n)) {
                    collection.push(object[n]);
                }
            }
        }

        private instantiateEnemy = (enemy: IEnemy): ICompiledEnemy => {
            var self = this;

            if (!enemy) {
                return null;
            }

            // A trick to work with a compiled enemy here as id is lacking in enemy and a direct cast is not possible.
            var compiledEnemy = <ICompiledEnemy><any>enemy;

            var items = <IItem[]>[];

            if (enemy.items) {
                enemy.items.forEach((def: () => IItem) => {
                    items.push(StoryScript.definitionToObject(def));
                });
            }

            compiledEnemy.items = items;

            self.addProxy(compiledEnemy, 'item');

            return compiledEnemy;
        }

        private instantiatePerson = (person: IPerson): ICompiledPerson => {
            var self = this;

            if (!person) {
                return null;
            }

            var compiledPerson = <ICompiledPerson>self.instantiateEnemy(person);

            if (compiledPerson.conversation) {
                compiledPerson.conversation.setStartNode = (person: ICompiledPerson, nodeName: string) => {
                    self.setStartNode(person, nodeName)
                };
            }

            var quests = <IQuest[]>[];

            if (person.quests) {
                person.quests.forEach((def: () => IQuest) => {
                    quests.push(StoryScript.definitionToObject(def));
                });
            }

            compiledPerson.quests = quests;

            // As far as I can tell right now, there is no reason to add quests to a person at run-time.
            //self.addProxy(compiledPerson, 'quest');

            return compiledPerson;
        }

        private setStartNode(person: ICompiledPerson, nodeName: string): void {
            var node = person.conversation.nodes.filter(n => n.node === nodeName)[0];

            if (node == null) {
                console.log("Cannot set conversation start node to node " + nodeName + ". A node with this name is not defined.");
                return;
            }

            node.start = true;
        }

        private addProxy(entry, collectionType?: string) {
            var self = this;

            if (collectionType === 'enemy') {
                entry.enemies.push = (<any>entry.enemies.push).proxy(function (push: Function, selector: string | (() => IEnemy)) {
                    var enemy = null;

                    if (typeof selector !== 'object') {
                        enemy = self.game.getEnemy(selector);
                    }
                    else {
                        // Todo: should I not invoke the function here?
                        enemy = <any>selector;
                    }

                    push.call(this, enemy);

                    if (self.ruleService.addEnemyToLocation) {
                        self.ruleService.addEnemyToLocation(self.game.currentLocation, enemy);
                    }
                });
            }
            if (collectionType === 'item') {
                entry.items.push = (<any>entry.items.push).proxy(function (push: Function, selector: string | (() => IItem)) {
                    var item = null;

                    if (typeof selector !== 'object') {
                        item = self.game.getItem(selector);
                    }
                    else {
                        // Todo: should I not invoke the function here?
                        item = <any>selector;
                    }

                    push.call(this, item);
                });
            }
        }
    }

    GameService.$inject = ['dataService', 'locationService', 'characterService', 'ruleService', 'game', 'gameNameSpace', 'definitions'];
}