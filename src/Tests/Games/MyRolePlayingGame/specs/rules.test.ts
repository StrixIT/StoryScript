import { describe, test, expect } from 'vitest';
import { Character, IGame, Rules } from '../../../../Games/MyRolePlayingGame/types';
import { ICharacter, IEnemy, ICompiledLocation, IHelpers, ICreateCharacter, ICombatSetup, ICombatTurn } from 'storyScript/Interfaces/storyScript';

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
            hitpoints: 10,
            currentHitpoints: 10
        };

        const setup = <ICombatSetup<ICombatTurn>>[{ character: character, target: enemy }];
        setup.round = 1;
        service.combat.fight(game, setup);

        // Character default strength 1 + 6.
        var expected = 3;

        expect(enemy.currentHitpoints).toEqual(expected);
    });

    test("should create a new character", function() {
        var service = Rules();
        var character = service.character.createCharacter(<IGame>{}, <ICreateCharacter>{});
        expect(character).not.toBeNull();
    });

});