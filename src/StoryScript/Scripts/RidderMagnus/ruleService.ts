module RidderMagnus {
    export class RuleService implements ng.IServiceProvider, StoryScript.IRuleService {
        private game: IGame;

        constructor(game: IGame) {
            var self = this;
            self.game = game;
        }

        public $get(game: IGame): StoryScript.IRuleService {
            var self = this;
            self.game = game;

            return {
                getCreateCharacterSheet: self.getCreateCharacterSheet,
                createCharacter: self.createCharacter,
                fight: self.fight,
                hitpointsChange: self.hitpointsChange,
                scoreChange: self.scoreChange
            };
        }

        getCreateCharacterSheet = (): StoryScript.ICreateCharacter => {
            return {
                steps: [
                    // Add the character creation steps here.
                    {
                        questions: [
                            {
                                question: 'Voordat je een schildknaap werd, ging je naar:',
                                entries: [
                                    {
                                        text: 'Een militaire school',
                                        value: 'vechten',
                                        bonus: 1
                                    },
                                    {
                                        text: 'Zweinstein',
                                        value: 'toveren',
                                        bonus: 1
                                    },
                                    {
                                        text: 'De politieschool',
                                        value: 'zoeken',
                                        bonus: 1
                                    },
                                    {
                                        text: 'Geen school, ik leefde op straat',
                                        value: 'snelheid',
                                        bonus: 1
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        questions: [
                            {
                                question: 'Daarna was je zeven jaar de schildknaap van:',
                                entries: [
                                    {
                                        text: 'Gerda de Sterke',
                                        value: 'vechten',
                                        bonus: 1
                                    },
                                    {
                                        text: 'Mihar de Magiër',
                                        value: 'toveren',
                                        bonus: 1
                                    },
                                    {
                                        text: 'Falco de Meesterdief',
                                        value: 'sluipen',
                                        bonus: 1
                                    },
                                    {
                                        text: 'Vanja de Vlugge',
                                        value: 'snelheid',
                                        bonus: 1
                                    }
                                ]
                            }
                        ]
                    }
                ]
            };
        }

        public createCharacter(characterData: StoryScript.ICreateCharacter): StoryScript.ICharacter {
            var self = this;
            var character = new Character();
            return character;
        }

        public enterLocation(location: StoryScript.ICompiledLocation): void {
            var self = this;

            //I want to erase actionlog first
            self.game.actionLog = [];

            self.game.logToActionLog('Je komt aan in ' + location.name);

            if (location.id != 'start' && !location.hasVisited) {
                self.game.character.score += 1;
            }
        }

        public initCombat(location: ICompiledLocation) {
            var self = this;

            location.enemies.forEach(function (enemy) {
                self.game.logToActionLog('Er is hier een ' + enemy.name);
            });

            if (self.game.currentLocation.sluipCheck && !self.game.currentLocation.hasVisited) {
                // check stats
                var roll = self.game.rollDice('1d6+' + (self.game.character.zoeken + self.game.character.sluipen));

                if (roll >= self.game.currentLocation.sluipCheck) {

                    var sneakActions = <IAction[]>[];

                    self.game.currentLocation.enemies.forEach((enemy: IEnemy) => {
                        sneakActions.push({
                            sneakEnemy: enemy,
                            text: 'Besluip ' + enemy.name,
                            type: StoryScript.ActionType.Combat,
                            execute: (game: IGame) => {
                                // Do damage to sneaked enemy.
                                self.game.fight(enemy);

                                // Move all enemies into combat.
                                game.currentLocation.actions.filter((action: IAction) => {
                                    return action.sneakEnemy != undefined && action.sneakEnemy.hitpoints > 0;
                                }).forEach((action: IAction) => {
                                    game.currentLocation.enemies.push(action.sneakEnemy);
                                });

                                // Remove the remaining sneak actions
                                game.currentLocation.actions = game.currentLocation.actions.filter((action: IAction) => {
                                    return action.sneakEnemy == undefined;
                                });

                                if (self.game.currentLocation.enemies.length > 0) {
                                    self.game.currentLocation.combatActions.push(Actions.Flee('Vluchten!'));
                                }
                            }
                        });
                    });

                    self.game.currentLocation.enemies = [];
                    self.game.currentLocation.actions = sneakActions.concat(self.game.currentLocation.actions);
                }
            }
            else if (self.game.currentLocation.enemies.length > 0) {
                self.game.currentLocation.combatActions.push(Actions.Flee('Vluchten!'));
            }
        }

        fight = (enemy: StoryScript.IEnemy): boolean => {
            var self = this;
            var win = false;
            var check = self.game.rollDice('1d6+' + self.game.character.vechten);

            var characterDamage = check + self.game.character.vechten + self.game.calculateBonus(self.game.character, 'attack') - self.game.calculateBonus(<any>enemy, 'defense');
            self.game.logToActionLog('Je doet de ' + enemy.name + ' ' + characterDamage + ' schade!');

            enemy.hitpoints -= characterDamage;
            win = enemy.hitpoints <= 0

            if (win) {
                self.game.logToActionLog('Je verslaat de ' + enemy.name + '!');
                self.game.logToLocationLog('Er ligt hier een dode ' + enemy.name + ', door jou verslagen.');
            }

            self.game.currentLocation.enemies.filter((enemy: IEnemy) => { return enemy.hitpoints > 0; }).forEach(function (enemy) {
                var check = self.game.rollDice(enemy.attack);
                var enemyDamage = Math.max(0, (check - (self.game.character.snelheid + self.game.calculateBonus(self.game.character, 'defense'))) + self.game.calculateBonus(<any>enemy, 'damage'));
                self.game.logToActionLog('De ' + enemy.name + ' doet ' + enemyDamage + ' schade!');
                self.game.character.currentHitpoints -= enemyDamage;
            });

            return win;
        }

        enemyDefeated(enemy: IEnemy) {
            var self = this;

            if (enemy.reward) {
                self.game.character.score += enemy.reward;
            }
        }

       
        hitpointsChange(change: number) {
            var self = this;

            // Implement additional logic to occur when hitpoints are lost. Return true when the character has been defeated.
            return false;
        }

        scoreChange(change: number): boolean {
            var self = this;

            // Implement logic to occur when the score changes. Return true when the character gains a level.
            return false;
        }
    }

    RuleService.$inject = ['game'];

    var storyScriptModule = angular.module("storyscript");
    storyScriptModule.service("ruleService", RuleService);
}