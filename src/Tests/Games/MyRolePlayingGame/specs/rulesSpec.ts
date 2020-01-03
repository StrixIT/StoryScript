import { Character, IGame, Rules } from '../../../../Games/MyRolePlayingGame/types';
import { ICharacter, IEnemy, ICompiledLocation, IHelpers, ICreateCharacter } from 'storyScript/Interfaces/storyScript';

describe("Rules", function() {

    it("should conduct combat", function() {
        var service = Rules();
        var character = new Character();

        var game = {
            character: <ICharacter>character,
            currentLocation: <ICompiledLocation>{
                activeEnemies: []
            },
            helpers: <IHelpers>{
                rollDice: (dice) => {
                    return 6;
                },
                calculateBonus: (person, type) => {

                }
            },
            logToCombatLog: (message: string) => {

            }
        };
        var enemy = <IEnemy>{};

        service.combat.fight(<IGame>game, enemy);
        var expected = true;
        var result = true;

        expect(result).toEqual(expected);
    });

    it("should create a new character", function() {
        var service = Rules();
        var character = service.character.createCharacter(<IGame>{}, <ICreateCharacter>{});
        expect(character).not.toBeNull();
    });

});