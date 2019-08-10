namespace RidderMagnus {
    export function Rules(): StoryScript.IRules {
        return {
            general: {
                scoreChange: (game: IGame, change: number): boolean => {
                    var self = this;
        
                    // Implement logic to occur when the score changes. Return true when the character gains a level.
                    return false;
                }
            },

            character: {
                getSheetAttributes: (): string[] => {
                    return [
                        'vechten',
                        'sluipen',
                        'zoeken',
                        'toveren',
                        'snelheid'
                    ];
                },

                getCreateCharacterSheet: (): StoryScript.ICreateCharacter => {
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
                },

                createCharacter: (game: IGame, characterData: StoryScript.ICreateCharacter): StoryScript.ICharacter => {
                    var self = this;
                    var character = new Character();
                    return character;
                }
            },

            exploration: {
                enterLocation: (game: IGame, location: StoryScript.ICompiledLocation): void => {
                    var self = this;

                    //I want to erase actionlog first
                    game.actionLog = [];

                    game.logToActionLog('Je komt aan in ' + location.name);

                    if (location.id != 'start' && !location.hasVisited) {
                        game.character.score += 1;
                    }

                    if (location.activeEnemies) {
                        location.activeEnemies.forEach(function (enemy) {
                            game.logToActionLog('Er is hier een ' + enemy.name);
                        });
                    }
                }
            },

            combat: {
                initCombat: (game: IGame, location: ICompiledLocation): void => {
                    var self = this;

                    if (game.currentLocation && game.currentLocation.sluipCheck && !game.currentLocation.hasVisited && !game.currentLocation.combatActions.some(a => (<IAction>a).isSneakAction)) {
                        // check stats
                        var roll = game.helpers.rollDice('1d6+' + (game.character.zoeken + game.character.sluipen));

                        if (roll >= game.currentLocation.sluipCheck) {

                            game.currentLocation.activeEnemies.forEach((enemy: IEnemy, index: number) => {
                                var sneakAction = {
                                    isSneakAction: true,
                                    text: 'Besluip ' + enemy.name,
                                    type: StoryScript.ActionType.Combat,
                                    execute: (game: IGame, actionIndex: number) => {
                                        var undef = typeof enemy === 'undefined';

                                        var theEnemy = undef ? game.currentLocation.activeEnemies[actionIndex] : enemy;

                                        // Do damage to sneaked enemy.
                                        game.fight(theEnemy, false);
                                        removeSneakAction(game);
                                        addFleeAction(game);
                                    }
                                };

                                game.currentLocation.combatActions.splice(index, 0, sneakAction);
                            });
                        }
                    }
                    else {
                        addFleeAction(game);
                    }
                },

                fight: (game: IGame, enemy: IEnemy, retaliate?: boolean): void => {
                    var self = this;
                    retaliate = retaliate == undefined ? true : retaliate;

                    var check = game.helpers.rollDice('1d6+' + game.character.vechten);
                    var characterDamage = check + game.character.vechten + game.helpers.calculateBonus(game.character, 'attack') - game.helpers.calculateBonus(enemy, 'defense');
                    game.logToCombatLog('Je doet de ' + enemy.name + ' ' + characterDamage + ' schade!');
                    enemy.hitpoints -= characterDamage;

                    removeSneakAction(game);
                    addFleeAction(game);

                    if (enemy.hitpoints <= 0) {
                        game.logToCombatLog('Je verslaat de ' + enemy.name + '!');
                        game.logToLocationLog('Er ligt hier een dode ' + enemy.name + ', door jou verslagen.');
                    }

                    if (retaliate) {
                        game.currentLocation.activeEnemies.filter((enemy: IEnemy) => { return enemy.hitpoints > 0; }).forEach(function (enemy) {
                            var check = game.helpers.rollDice(enemy.attack);
                            var enemyDamage = Math.max(0, (check - (game.character.snelheid + game.helpers.calculateBonus(game.character, 'defense'))) + game.helpers.calculateBonus(enemy, 'damage'));
                            game.logToCombatLog('De ' + enemy.name + ' doet ' + enemyDamage + ' schade!');
                            game.character.currentHitpoints -= enemyDamage;
                        });
                    }
                },

                enemyDefeated(game: IGame, enemy: IEnemy): void {
                    var self = this;

                    if (enemy.reward) {
                        game.character.score += enemy.reward;
                    }
                }
            }
        };

        function removeSneakAction(game: IGame) {
            // Remove the remaining sneak actions
            var indexes = <number[]>[];

            game.currentLocation.combatActions.forEach((action: IAction, index: number) => {
                if (action.isSneakAction) {
                    indexes.push(index - indexes.length);
                }
            });

            indexes.forEach(i => {
                game.currentLocation.combatActions.splice(i, 1);
            });
        }
    }
}