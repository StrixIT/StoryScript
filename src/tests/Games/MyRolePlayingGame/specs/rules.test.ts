import { describe, test, expect } from 'vitest';
import {Character, IGame, IItem, Rules} from '../../../../Games/MyRolePlayingGame/types';
import { ICharacter, IEnemy, ICompiledLocation, IHelpers, ICreateCharacter, ICombatSetup, ICombatTurn } from 'storyScript/Interfaces/storyScript';

describe("Rules", function() {

    test("should conduct combat", function() {
        const service = Rules();
        const character = new Character();

        const game = <IGame>{
            activeCharacter: <ICharacter>character,
            currentLocation: <ICompiledLocation>{
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
        const enemy = <IEnemy>{
            hitpoints: 10,
            currentHitpoints: 10
        };
        
        const sword = <IItem>{
            attack: 'id6'
        }

        const setup = <ICombatSetup<ICombatTurn>>[{ character: character, target: enemy, item: sword }];
        setup.characters = [character];
        setup.enemies = [enemy];
        setup.round = 1;
        service.combat.fight(game, setup);

        // Character default strength 1 + 6.
        const expected = 3;

        expect(enemy.currentHitpoints).toEqual(expected);
    });

    test("should create a new character", function() {
        const service = Rules();
        const character = service.character.createCharacter(<IGame>{}, <ICreateCharacter>{});
        expect(character).not.toBeNull();
    });

});