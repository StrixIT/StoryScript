namespace AdventureGame {
    export class Rules implements StoryScript.IRules {
        getCombinationActions = (): StoryScript.ICombinationAction[] => {
            return [
                {
                    text: Constants.USE,
                    preposition: 'on'
                },
                {
                    text: Constants.THROW,
                    preposition: 'at'
                },
                {
                    text: Constants.TOUCH,
                    requiresTarget: false
                },
                {
                    text: Constants.LOOKAT,
                    preposition: 'at',
                    requiresTarget: false,
                    failText: (game, tool, target): string => { return 'You look at the ' + target.name + '. There is nothing special about it';}
                },
                {
                    text: Constants.WALK,
                    preposition: 'to',
                    requiresTarget: false
                }
            ];
        }

        getSheetAttributes = () => {
            return [
                // Add character sheet property names here
            ];
        }

        getCreateCharacterSheet = (): StoryScript.ICreateCharacter => {
            return {
                steps: [
                    // Add the character creation steps here.
                ]
            };
        }

        createCharacter = (game: IGame, characterData: StoryScript.ICreateCharacter): StoryScript.ICharacter => {
            var self = this;
            var character = new Character();
            return character;
        }

        fight = (game: IGame, enemy: ICompiledEnemy, retaliate?: boolean) => {
            var self = this;
            retaliate = retaliate == undefined ? true : retaliate;

            // Implement character attack here.

            if (retaliate) {
                game.currentLocation.activeEnemies.filter((enemy: ICompiledEnemy) => { return enemy.hitpoints > 0; }).forEach(function (enemy) {
                    // Implement monster attack here
                });
            }
        }

        scoreChange(game: IGame, change: number): boolean {
            var self = this;

            // Implement logic to occur when the score changes. Return true when the character gains a level.
            return false;
        }
    }
}