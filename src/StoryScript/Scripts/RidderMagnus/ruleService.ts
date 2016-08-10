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

        public initCombat(location: StoryScript.ICompiledLocation) {
            var self = this;

            location.enemies.forEach(function (enemy) {
                self.game.logToActionLog('Er is hier een ' + enemy.name);
            });

           //als er een flee-action is: self.addFleeAction(location);
        }

        fight = (enemy: StoryScript.IEnemy): boolean => {
            var self = this;
            var check = self.game.rollDice('1d6+' + self.game.character.vechten);

            var characterDamage = check + self.game.character.vechten + self.game.calculateBonus(self.game.character, 'attack') - self.game.calculateBonus(<any>enemy, 'defense');
            self.game.logToActionLog('Je doet de ' + enemy.name + ' ' + characterDamage + ' schade!');

            enemy.hitpoints -= characterDamage;

            if (enemy.hitpoints <= 0) {
                self.game.logToActionLog('Je verslaat de ' + enemy.name + '!');
                self.game.logToLocationLog('Er ligt hier een dode ' + enemy.name + ', door jou verslagen.');
                return true;
            }

            self.game.currentLocation.enemies.forEach(function (enemy) {
                var check = self.game.rollDice(enemy.attack);
                var enemyDamage = Math.max(0, (check - (self.game.character.snelheid + self.game.calculateBonus(self.game.character, 'defense'))) + self.game.calculateBonus(<any>enemy, 'damage'));
                self.game.logToActionLog('De ' + enemy.name + ' doet ' + enemyDamage + ' schade!');
                self.game.character.currentHitpoints -= enemyDamage;
            });

            return false;
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