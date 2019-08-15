namespace TheMiner {
    export class Rules implements StoryScript.IRules {
        setup = <StoryScript.ISetupRules>{
            getCombinationActions: (): StoryScript.ICombinationAction[] => {
                return [
                   { text: Constants.USE,
                    preposition: 'on'
                   },
                   { text: Constants.LOOKAT,
                    preposition: 'at',
                    requiresTool: false,
                    failText: (game, target, tool): string => {
                        return 'You look at the ' + target.name + ', there is nothing special about it.';
                    }
                   },
                   {
                    text: Constants.TOUCH,  
                    requiresTool: false
                   },
                   {
                    text: Constants.TAKE,  
                    requiresTool: false
                   }

                    // Add combination action names here if you want to use this feature.
                ];
            }
        };

        general = <StoryScript.IGeneralRules>{  
            scoreChange: (game: IGame, change: number): boolean => {
                var self = this;
    
                // Implement logic to occur when the score changes. Return true when the character gains a level.
                return false;
            }
        };

        character = <StoryScript.ICharacterRules>{
            getSheetAttributes: (): string[] => {
                return [
                    // Add the character attributes that you want to show on the character sheet here
                ];
            },

            getCreateCharacterSheet: (): StoryScript.ICreateCharacter => {
                return {
                    steps: [
                        // Add the character creation steps here, if you want to use character creation.
                    ]
                };
            },

            createCharacter: (game: IGame, characterData: StoryScript.ICreateCharacter): StoryScript.ICharacter => {
                var self = this;
                var character = new Character();
                return character;
            }
        };

        exploration = <StoryScript.IExplorationRules>{
            
        };

        combat = <StoryScript.ICombatRules>{     
            fight: (game: IGame, enemy: IEnemy, retaliate?: boolean) => {
                var self = this;
                retaliate = retaliate == undefined ? true : retaliate;

                // Implement character attack here.

                if (retaliate) {
                    game.currentLocation.activeEnemies.filter((enemy: IEnemy) => { return enemy.hitpoints > 0; }).forEach(function (enemy) {
                        // Implement monster attack here
                    });
                }
            }
        };
    }
}