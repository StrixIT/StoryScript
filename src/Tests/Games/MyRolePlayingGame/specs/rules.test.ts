import { describe, test, expect } from 'vitest';
import { Character, IGame, Rules } from '../../../../Games/MyRolePlayingGame/types';
import { ICharacter, IEnemy, ICompiledLocation, IHelpers, ICreateCharacter } from 'storyScript/Interfaces/storyScript';

describe("Rules", function() {

    test("should conduct combat", function() {
        var service = Rules();
        var character = new Character();

        var game = <IGame>{
            activeCharacter: <ICharacter>character,
            currentLocation: <ICompiledLocation>{
                activeEnemies: []
            },
            helpers: <IHelpers>{
                rollDice: (dice) => {
                    return 6;
                },
                calculateBonus: (person, type) => {
                    return 0;
                }
            },
            logToCombatLog: (message: string) => {

            }
        };
        var enemy = <IEnemy>{
            hitpoints: 10
        };

        service.combat.fight(<IGame>game, <ICharacter>{}, enemy);

        // Character default strength 1 + 6.
        var expected = 3;

        expect(enemy.hitpoints).toEqual(expected);
    });

    test("should create a new character", function() {
        var service = Rules();
        var character = service.character.createCharacter(<IGame>{}, <ICreateCharacter>{});
        expect(character).not.toBeNull();
    });

});