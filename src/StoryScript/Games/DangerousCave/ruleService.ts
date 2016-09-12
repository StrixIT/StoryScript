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
            character.items.push(self.game.getItem(chosenItem.value));
            return character;
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

            location.enemies.forEach(function (enemy) {
                self.game.logToActionLog('Er is hier een ' + enemy.name);
            });

            self.addFleeAction(location);
        }

        fight = (enemy: StoryScript.IEnemy) => {
            var self = this;
            var check = self.game.rollDice(self.game.character.kracht + 'd6');
            var characterDamage = check + self.game.character.oplettendheid + self.game.calculateBonus(self.game.character, 'attack') - self.game.calculateBonus(<any>enemy, 'defense');
            self.game.logToCombatLog('Je doet de ' + enemy.name + ' ' + characterDamage + ' schade!');
            enemy.hitpoints -= characterDamage;

            if (enemy.hitpoints <= 0) {
                self.game.logToCombatLog('Je verslaat de ' + enemy.name + '!');
                self.game.logToLocationLog('Er ligt hier een dode ' + enemy.name + ', door jou verslagen.');
            }

            self.game.currentLocation.enemies.filter((enemy: IEnemy) => { return enemy.hitpoints > 0; }).forEach(function (enemy) {
                var check = self.game.rollDice(enemy.attack);
                var enemyDamage = Math.max(0, (check - (self.game.character.vlugheid + self.game.calculateBonus(self.game.character, 'defense'))) + self.game.calculateBonus(<any>enemy, 'damage'));
                self.game.logToCombatLog('De ' + enemy.name + ' doet ' + enemyDamage + ' schade!');
                self.game.character.currentHitpoints -= enemyDamage;
            });
        }

        enemyDefeated(enemy: IEnemy) {
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

            return self.game.character.currentHitpoints <= 0;
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
            var numberOfEnemies = location.enemies.length;
            var fleeAction = location.combatActions.get(Actions.Flee);

            if (fleeAction) {
                location.combatActions.splice(location.combatActions.indexOf(fleeAction), 1);
            }

            if (numberOfEnemies > 0 && numberOfEnemies < self.game.character.vlugheid) {
                var action = Actions.Flee('');
                (<any>action).id = (<any>Actions.Flee).name;
                location.combatActions.push(action);
            }
        }
    }

    RuleService.$inject = ['game'];
}