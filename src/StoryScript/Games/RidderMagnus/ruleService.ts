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
                getSheetAttributes: self.getSheetAttributes,
                getCreateCharacterSheet: self.getCreateCharacterSheet,
                createCharacter: self.createCharacter,
                fight: self.fight,
                scoreChange: self.scoreChange,
                initCombat: self.initCombat,
                enterLocation: self.enterLocation
            };
        }

        getSheetAttributes = () => {
            return [
                'vechten',
                'sluipen',
                'zoeken',
                'toveren',
                'snelheid'
            ];
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

            if (location.activeEnemies) {
                location.activeEnemies.forEach(function (enemy) {
                    self.game.logToActionLog('Er is hier een ' + enemy.name);
                });
            }
        }

        public initCombat(location: ICompiledLocation) {
            var self = this;

            if (self.game.currentLocation && self.game.currentLocation.sluipCheck && !self.game.currentLocation.hasVisited) {
                // check stats
                var roll = self.game.rollDice('1d6+' + (self.game.character.zoeken + self.game.character.sluipen));

                if (roll >= self.game.currentLocation.sluipCheck) {

                    var sneakActions = <IAction[]>[];

                    self.game.currentLocation.activeEnemies.forEach((enemy: IEnemy) => {
                        sneakActions.push({
                            isSneakAction: true,
                            text: 'Besluip ' + enemy.name,
                            type: StoryScript.ActionType.Combat,
                            execute: (game: IGame) => {
                                // Do damage to sneaked enemy.
                                self.game.fight(enemy, false);

                                // Remove the remaining sneak actions
                                game.currentLocation.combatActions = game.currentLocation.combatActions.filter((action: IAction) => {
                                    return !action.isSneakAction;
                                });

                                // Add the flee action.
                                self.addFleeAction(self.game);
                            }
                        });
                    });

                    self.game.currentLocation.combatActions = sneakActions.concat(self.game.currentLocation.combatActions);
                }
            }
            else {
                self.addFleeAction(self.game);
            }
        }

        addFleeAction = (game: IGame) => {
            if (game.currentLocation && game.currentLocation.activeEnemies.length > 0 && !game.currentLocation.combatActions.some((action) => { return action.text == 'Vluchten!'; })) {
                game.currentLocation.combatActions.push(Actions.Flee('Vluchten!'));
            }
        }

        fight = (enemy: StoryScript.IEnemy, retaliate?: boolean) => {
            var self = this;
            retaliate = retaliate == undefined ? true : retaliate;

            var check = self.game.rollDice('1d6+' + self.game.character.vechten);
            var characterDamage = check + self.game.character.vechten + self.game.calculateBonus(self.game.character, 'attack') - self.game.calculateBonus(<any>enemy, 'defense');
            self.game.logToCombatLog('Je doet de ' + enemy.name + ' ' + characterDamage + ' schade!');
            enemy.hitpoints -= characterDamage;

            if (enemy.hitpoints <= 0) {
                self.game.logToCombatLog('Je verslaat de ' + enemy.name + '!');
                self.game.logToLocationLog('Er ligt hier een dode ' + enemy.name + ', door jou verslagen.');
            }

            if (retaliate) {
                self.game.currentLocation.activeEnemies.filter((enemy: IEnemy) => { return enemy.hitpoints > 0; }).forEach(function (enemy) {
                    var check = self.game.rollDice(enemy.attack);
                    var enemyDamage = Math.max(0, (check - (self.game.character.snelheid + self.game.calculateBonus(self.game.character, 'defense'))) + self.game.calculateBonus(<any>enemy, 'damage'));
                    self.game.logToCombatLog('De ' + enemy.name + ' doet ' + enemyDamage + ' schade!');
                    self.game.character.currentHitpoints -= enemyDamage;
                });
            }
        }

        enemyDefeated(enemy: IEnemy) {
            var self = this;

            if (enemy.reward) {
                self.game.character.score += enemy.reward;
            }
        }

        scoreChange(change: number): boolean {
            var self = this;

            // Implement logic to occur when the score changes. Return true when the character gains a level.
            return false;
        }

        prepareReplies = (game: IGame, person: IPerson, node: StoryScript.IConversationNode): void => {

        }

        handleReply = (game: IGame, person: IPerson, node: StoryScript.IConversationNode, reply: StoryScript.IConversationReply): void => {
            if (person.id == (<any>Persons.KoninginDagmar).name && reply.linkToNode == 'accept') {
                var test = 0;
            }
        }
    }

    RuleService.$inject = ['game'];
}