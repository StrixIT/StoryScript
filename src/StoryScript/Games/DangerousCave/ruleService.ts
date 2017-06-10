module DangerousCave {
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
                getSheetAttributes: self.getSheetAttributes,
                getCreateCharacterSheet: self.getCreateCharacterSheet,
                createCharacter: self.createCharacter,
                enterLocation: self.enterLocation,
                initCombat: self.initCombat,
                fight: self.fight,
                hitpointsChange: self.hitpointsChange,
                scoreChange: self.scoreChange
            };
        }

        getSheetAttributes = () => {
            return [
                'kracht',
                'vlugheid',
                'oplettendheid',
                'defense'
            ];
        }

        getCreateCharacterSheet = (): StoryScript.ICreateCharacter => {
            return {
                steps: [
                    {
                        attributes: [
                            {
                                question: 'Hoe heet je?',
                                entries: [
                                    {
                                        attribute: 'name'
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        questions: [
                            {
                                question: 'Ben je sterk, snel of slim?',
                                entries: [
                                    {
                                        text: 'Sterk',
                                        value: 'kracht',
                                        bonus: 1
                                    },
                                    {
                                        text: 'Snel',
                                        value: 'vlugheid',
                                        bonus: 1
                                    },
                                    {
                                        text: 'Slim',
                                        value: 'oplettendheid',
                                        bonus: 1
                                    }
                                ]
                            },
                            {
                                question: 'Wat neem je mee?',
                                entries: [
                                    {
                                        text: 'Dolk',
                                        value: (<any>Items.Dagger).name,
                                    },
                                    {
                                        text: 'Leren helm',
                                        value: (<any>Items.LeatherHelmet).name,
                                    },
                                    {
                                        text: 'Lantaren',
                                        value: (<any>Items.Lantern).name,
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
            var chosenItem = characterData.steps[1].questions[1].selectedEntry;
            character.items.push(self.game.helpers.getItem(chosenItem.value));
            return character;
        }

        public addEnemyToLocation(location: StoryScript.ICompiledLocation, enemy: ICompiledEnemy) {
            var self = this;
            self.addFleeAction(location);
        }

        public enterLocation(location: StoryScript.ICompiledLocation): void {
            var self = this;

            self.game.logToActionLog('Je komt aan in ' + location.name);

            if (location.id != 'start' && !location.hasVisited) {
                self.game.character.score += 1;
            }

            if (location.activeEnemies) {
                location.activeEnemies.forEach(function (enemy) {
                    self.game.logToActionLog('Er is hier een ' + enemy.name);
                });
            }
        }

        public initCombat(location: StoryScript.ICompiledLocation) {
            var self = this;

            self.addFleeAction(location);
        }

        fight = (enemy: ICompiledEnemy) => {
            var self = this;
            var check = self.game.helpers.rollDice(6, self.game.character.kracht);
            var characterDamage = check + self.game.character.oplettendheid + self.game.helpers.calculateBonus(self.game.character, 'attack') - self.game.helpers.calculateBonus(enemy, 'defense');
            self.game.logToCombatLog('Je doet de ' + enemy.name + ' ' + characterDamage + ' schade!');
            enemy.hitpoints -= characterDamage;

            if (enemy.hitpoints <= 0) {
                self.game.logToCombatLog('Je verslaat de ' + enemy.name + '!');
                self.game.logToLocationLog('Er ligt hier een dode ' + enemy.name + ', door jou verslagen.');
            }

            self.game.currentLocation.activeEnemies.filter((enemy: ICompiledEnemy) => { return enemy.hitpoints > 0; }).forEach(function (enemy) {
                var check = self.game.helpers.rollDice(enemy.attack);
                var enemyDamage = Math.max(0, (check - (self.game.character.vlugheid + self.game.helpers.calculateBonus(self.game.character, 'defense'))) + self.game.helpers.calculateBonus(enemy, 'damage'));
                self.game.logToCombatLog('De ' + enemy.name + ' doet ' + enemyDamage + ' schade!');
                self.game.character.currentHitpoints -= enemyDamage;
            });
        }

        enemyDefeated(enemy: ICompiledEnemy) {
            var self = this;

            if (enemy.reward) {
                self.game.character.score += enemy.reward;
            }
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

            self.game.state = StoryScript.GameState.Play;
        }


        hitpointsChange(change: number) {
            var self = this;

            if (self.game.character.hitpoints < 5) {
                self.game.logToActionLog('Pas op! Je bent zwaar gewond!');
                self.game.logToCombatLog('Pas op! Je bent zwaar gewond!');
            }
        }

        scoreChange(change: number): boolean {
            var self = this;
            var character = self.game.character;
            character.scoreToNextLevel += change;
            var levelUp = character.level >= 1 && character.scoreToNextLevel >= 2 + (2 * (character.level));

            self.game.logToActionLog('Je verdient ' + change + ' punt(en)');

            if (levelUp) {
                character.level += 1;
                character.scoreToNextLevel = 0;
                self.game.logToActionLog('Je wordt hier beter in! Je bent nu niveau ' + character.level);
            }

            return levelUp;
        }

        private addFleeAction(location: StoryScript.ICompiledLocation): void {
            var self = this;
            var numberOfEnemies = location.activeEnemies.length;
            var fleeAction = location.combatActions.get(Actions.Flee);


            if (!fleeAction && numberOfEnemies > 0 && numberOfEnemies < self.game.character.vlugheid) {
                var action = Actions.Flee('');
                (<any>action).id = (<any>Actions.Flee).name;
                location.combatActions.push(action);
            }
        }
    }

    RuleService.$inject = ['game'];
}