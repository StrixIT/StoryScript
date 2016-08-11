module StoryScript {
    export interface IGameService {
        init(): void;
        startNewGame(characterData: any): void;
        reset(): void;
        restart(): void;
        saveGame(): void;
        rollDice(dice: string): number;
        fight(enemy: IEnemy): void;
        scoreChange(change: number): void;
        hitpointsChange(change: number): void;
        changeGameState(state: string): void;
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
                rollDice: self.rollDice,
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

            self.game.createCharacterSheet = self.ruleService.getCreateCharacterSheet();
            self.game.createCharacterSheet.currentStep = 0;
            self.game.createCharacterSheet.nextStep = (data: ICreateCharacter) => { data.currentStep++; };

            if (self.ruleService.setupGame) {
                self.ruleService.setupGame(self.game);
            }

            // Game setup start
            self.game.highScores = [];
            self.game.actionLog = [];

            self.game.logToLocationLog = (message: string) => {
                self.game.currentLocation.log = self.game.currentLocation.log || [];
                self.game.currentLocation.log.push(message);
            }

            self.game.logToActionLog = (message: string) => {
                self.game.actionLog.splice(0, 0, message);
            }

            self.game.randomEnemy = (selector?: (enemy: IEnemy) => boolean): IEnemy => {
                var instance = StoryScript.random<IEnemy>(self.game.definitions.enemies, selector);
                var items = <IItem[]>[];

                if (instance.items) {
                    instance.items.forEach((def: () => IItem) => {
                        items.push(StoryScript.definitionToObject(def));
                    });
                }

                (<any>instance).items = items;
                return instance;
            }

            self.game.randomItem = (selector?: (item: IItem) => boolean): IItem => {
                var instance = StoryScript.random<IItem>(self.game.definitions.items, selector);
                return instance;
            }

            self.game.rollDice = self.rollDice;
            self.game.fight = self.fight;

            // Game setup end

            self.locationService.init(self.game);
            self.game.highScores = self.dataService.load<ScoreEntry[]>(StoryScript.DataKeys.HIGHSCORES);
            self.game.character = self.dataService.load<ICharacter>(StoryScript.DataKeys.CHARACTER);

            var locationName = self.dataService.load<string>(StoryScript.DataKeys.LOCATION);

            if (self.game.character && locationName) {
                var lastLocation = self.game.locations.get(locationName);
                var previousLocationName = self.dataService.load<string>(StoryScript.DataKeys.PREVIOUSLOCATION);

                if (previousLocationName) {
                    self.game.previousLocation = self.game.locations.get(previousLocationName);
                }

                self.locationService.changeLocation(lastLocation, self.game);
                self.game.state = 'play';
            }
            else {
                self.game.state = 'createCharacter';
            }

            self.game.calculateBonus = (person: ICharacter, type: string) => { return self.calculateBonus(self.game, person, type); };
        }

        reset = () => {
            var self = this;
            self.dataService.save(StoryScript.DataKeys.WORLD, {});
            self.locationService.init(self.game);
            var location = self.dataService.load(StoryScript.DataKeys.LOCATION);

            if (location) {
                self.locationService.changeLocation(location, self.game);
            }
        }

        startNewGame = (characterData: any): void => {
            var self = this;
            self.game.character = self.characterService.createCharacter(characterData);
            self.dataService.save(StoryScript.DataKeys.CHARACTER, self.game.character);
            self.game.changeLocation('Start');
        }

        restart = (): void => {
            var self = this;
            self.dataService.save(StoryScript.DataKeys.CHARACTER, {});
            self.dataService.save(StoryScript.DataKeys.LOCATION, '');
            self.dataService.save(StoryScript.DataKeys.PREVIOUSLOCATION, '');
            self.dataService.save(StoryScript.DataKeys.WORLD, {});
            self.init();
        }

        saveGame = (): void => {
            var self = this;
            self.dataService.save(StoryScript.DataKeys.CHARACTER, self.game.character);
            self.locationService.saveWorld(self.game.locations);
        }

        rollDice = (input: string): number => {
            //'xdy+/-z'
            var positiveModifier = input.indexOf('+') > -1;
            var splitResult = input.split('d');
            var numberOfDice = parseInt(splitResult[0]);
            splitResult = positiveModifier ? splitResult[1].split('+') : splitResult[1].split('-');
            var dieCount = parseInt(splitResult[0]);
            var bonus = parseInt(splitResult[1]);
            bonus = isNaN(bonus) ? 0 : bonus;
            bonus = positiveModifier ? bonus : bonus * -1;
            var result = 0;

            for (var i = 0; i < numberOfDice; i++) {
                result += Math.floor(Math.random() * dieCount + 1);
            }

            result += bonus;
            return result;
        }

        calculateBonus = (game: IGame, person: IActor, type: string) => {
            var self = this;
            var bonus = 0;

            if (game.character == person) {
                for (var n in (<ICharacter>person).equipment) {
                    var item = (<ICharacter>person).equipment[n];

                    if (item && item.bonuses && item.bonuses[type]) {
                        bonus += item.bonuses[type];
                    }
                };
            }
            else {
                if (person.items) {
                    person.items.forEach(function (item) {
                        if (item && item.bonuses && item.bonuses[type]) {
                            bonus += item.bonuses[type];
                        }
                    });
                }
            }

            return bonus;
        }

        fight = (enemy: IEnemy) => {
            var self = this;
            var win = self.ruleService.fight(enemy);

            if (win) {
                if (enemy.items && enemy.items.length) {
                    enemy.items.forEach(function (item) {
                        self.game.currentLocation.items = self.game.currentLocation.items || [];

                        // Todo: type
                        self.game.currentLocation.items.push(<any>item);
                    });

                    enemy.items.splice(0, enemy.items.length);
                }

                self.game.currentLocation.enemies.remove(enemy);

                if (self.ruleService.enemyDefeated) {
                    self.ruleService.enemyDefeated(enemy);
                }

                if (enemy.onDefeat) {
                    enemy.onDefeat(self.game);
                }
            }
        }

        scoreChange = (change: number): void => {
            var self = this;

            // Todo: change if xp can be lost.
            if (change > 0) {
                var character = self.game.character;
                var levelUp = self.ruleService.scoreChange(change);

                if (levelUp) {
                    self.game.state = 'levelUp';
                }
            }
        }

        hitpointsChange = (change: number): void => {
            var self = this;
            var defeat = self.ruleService.hitpointsChange(change);

            if (defeat) {
                self.game.state = 'gameOver';
            }
        }

        changeGameState = (state: string) => {
            var self = this;

            if (state == 'gameOver' || state == 'victory') {
                self.updateHighScore();
                self.dataService.save(StoryScript.DataKeys.HIGHSCORES, self.game.highScores);
            }
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

            self.definitions.items = <[() => IItem]>[];
            self.moveObjectPropertiesToArray(nameSpaceObject['Items'], self.definitions.items);

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
    }

    GameService.$inject = ['dataService', 'locationService', 'characterService', 'ruleService', 'game', 'gameNameSpace', 'definitions'];
}