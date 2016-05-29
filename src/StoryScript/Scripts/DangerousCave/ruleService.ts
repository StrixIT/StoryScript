module DangerousCave {
    export class RuleService implements ng.IServiceProvider, StoryScript.IRuleService {
        private game: Game;

        constructor(game: Game) {
            var self = this;
            self.game = game;
        }

        public $get(game: Game): StoryScript.IRuleService {
            var self = this;
            self.game = game;

            return {
                setupGame: self.setupGame,
                getCharacterForm: self.getCharacterForm,
                createCharacter: self.createCharacter,
                startGame: self.startGame,
                addEnemyToLocation: self.addEnemyToLocation,
                enterLocation: self.enterLocation,
                initCombat: self.initCombat,
                fight: self.fight,
                hitpointsChange: self.hitpointsChange,
                scoreChange: self.scoreChange
            };
        }

        setupGame = (game: StoryScript.IGame): void => {
            game.highScores = [];
            game.actionLog = [];

            game.logToLocationLog = (message: string) => {
                game.currentLocation.log = game.currentLocation.log || [];
                game.currentLocation.log.push(message);
            }

            game.logToActionLog = (message: string) => {
                game.actionLog.splice(0, 0, message);
            }
        }

        public getCharacterForm() {
            return {
                specialties: [
                    {
                        name: 'sterk',
                        value: 'Sterk'
                    },
                    {
                        name: 'snel',
                        value: 'Snel'
                    },
                    {
                        name: 'slim',
                        value: 'Slim'
                    }
                ],
                items: [
                    Items.Dagger(),
                    Items.LeatherHelmet(),
                    Items.Lantern()
                ]
            };
        }

        public createCharacter(characterData: any): StoryScript.ICharacter {
            var self = this;
            var character = new Character();
            character.name = characterData.name;

            switch (characterData.selectedSpecialty.name) {
                case 'sterk': {
                    character.kracht++;
                } break;
                case 'snel': {
                    character.vlugheid++;
                } break;
                case 'slim': {
                    character.oplettendheid++;
                } break;
            }

            character.items.push(characterData.selectedItem);
            return character;
        }

        public startGame() {
            var self = this;
            self.game.changeLocation(self.game.locations.first(Locations.Start));
        }

        public addEnemyToLocation(location: StoryScript.ICompiledLocation, enemy: StoryScript.IEnemy) {
            var self = this;
            self.addFleeAction(location);
        }

        public enterLocation(location: StoryScript.ICompiledLocation): void {
            var self = this;

            self.game.logToActionLog('Je komt aan in ' + location.name);

            if (location.id != 'start' && !location.hasVisited) {
                self.game.character.score += 1;
            }
        }

        public initCombat(location: StoryScript.ICompiledLocation) {
            var self = this;

            // Log the presense of enemies to the action log.
            location.enemies.forEach(function (enemy) {
                self.game.logToActionLog('Er is hier een ' + enemy.name);
            });

            self.addFleeAction(location);
        }

        levelUp = (reward: string) => {
            var self = this;

            if (reward != 'gezondheid') {
                self.game.character[reward]++;
            }
            else {
                self.game.character.hitpoints += 10;
                self.game.character.currentHitpoints += 10;
            }

            self.game.state = 'play';
        }

        fight = (enemyToFight: StoryScript.IEnemy) => {
            var self = this;

            // Todo: change when multiple enemies of the same type can be present.
            var enemy = self.game.currentLocation.enemies.first(enemyToFight.id);
            var check = self.game.rollDice(self.game.character.kracht + 'd6');

            var characterDamage = check + self.game.character.oplettendheid + self.game.calculateBonus(self.game.character, 'attack') - self.game.calculateBonus(enemy, 'defense');
            self.game.logToActionLog('Je doet de ' + enemy.name + ' ' + characterDamage + ' schade!');

            enemy.hitpoints -= characterDamage;

            // Todo: move to game service
            if (enemy.hitpoints <= 0) {
                self.game.logToActionLog('Je verslaat de ' + enemy.name + '!');
                self.game.logToLocationLog('Er ligt hier een dode ' + enemy.name + ', door jou verslagen.');

                if (enemy.items && enemy.items.length) {
                    enemy.items.forEach(function (item) {
                        self.game.currentLocation.items = self.game.currentLocation.items || [];

                        // Todo: type
                        self.game.currentLocation.items.push(<any>item);
                    });

                    enemy.items.splice(0, enemy.items.length);
                }

                if (enemy.reward) {
                    self.game.character.score += enemy.reward;
                }

                if (enemy.onDefeat) {
                    enemy.onDefeat(self.game);
                }

                self.game.currentLocation.enemies.remove(enemy);
            }

            self.game.currentLocation.enemies.forEach(function (enemy) {
                var check = self.game.rollDice(enemy.attack);
                var enemyDamage = Math.max(0, (check - (self.game.character.vlugheid + self.game.calculateBonus(self.game.character, 'defense'))) + self.game.calculateBonus(enemy, 'damage'));
                self.game.logToActionLog('De ' + enemy.name + ' doet ' + enemyDamage + ' schade!');
                self.game.character.currentHitpoints -= enemyDamage;
            });
        }

        private addFleeAction(location: StoryScript.ICompiledLocation): void {
            var self = this;
            var numberOfEnemies = location.enemies.length;
            var fleeAction = location.combatActions.first(Actions.Flee);

            if (fleeAction) {
                delete location.combatActions.splice(location.combatActions.indexOf(fleeAction), 1);
            }

            if (numberOfEnemies > 0 && numberOfEnemies < self.game.character.vlugheid) {
                location.combatActions.push(Actions.Flee(''));
            }
        }

        hitpointsChange(change: number) {
            var self = this;

            if (self.game.character.hitpoints < 5) {
                self.game.logToActionLog('Pas op! Je bent zwaar gewond!');
            }
        }

        scoreChange(change: number): boolean {
            var self = this;
            var character = self.game.character;
            var levelUp = character.level >= 1 && character.scoreToNextLevel >= 2 + (2 * (character.level));

            self.game.logToActionLog('Je verdient ' + change + ' punt(en)');

            if (levelUp) {
                self.game.logToActionLog('Je wordt hier beter in! Je bent nu niveau ' + character.level);
            }

            return levelUp;
        }
    }

    RuleService.$inject = ['game'];

    var storyScriptModule = angular.module("storyscript");
    storyScriptModule.service("ruleService", RuleService);
}