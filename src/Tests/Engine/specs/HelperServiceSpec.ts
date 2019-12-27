import { GetObjectFactory } from 'storyScript/run';
import { HelperService } from 'storyScript/Services/helperService';
import { GetDefinitions } from 'storyScript/ObjectConstructors';
import { IKey, IEnemy, ICharacter } from 'storyScript/Interfaces/storyScript';
import { IItem } from '../../../Games/MyRolePlayingGame/types';
import '../../../Games/MyRolePlayingGame/run';

describe("HelperService", function() {

    it("should retrieve a random item", function() {
        var service = getService();
        var random = service.randomItem();

        var itemIds = [
            'basementkey',
            'journal',
            'leatherboots',
            'sword'
        ];

        expect(random).not.toBe(null);
        expect(itemIds).toContain(random.id);
    });

    it("should retrieve a random enemy", function() {
        var service = getService();
        var random = service.randomEnemy();

        var itemIds = [
            'bandit'
        ];

        expect(random).not.toBe(null);
        expect(itemIds).toContain(random.id);
    });

    it("should retrieve an item using its id", function() {
        var service = getService();
        var definitions = GetDefinitions();
        var expected = find(definitions.items, 'Sword');

        var getWithId = service.getItem('Sword');

        expect(getWithId).toEqual(expected);
    });

    it("should retrieve an enemy using its id", function() {
        var service = getService();
        var definitions = GetDefinitions();
        var expected = find(definitions.enemies, 'Bandit');  

        // Set the execute to null because comparing the action function fails.
        expected.items[1].open.execute = null;

        var getWithId = service.getEnemy('Bandit');
        (<IKey>getWithId.items[1]).open.execute = null;

        expect(getWithId).toEqual(expected);
    });

    it("should return a number between 1 and six using rollDice with a number of 6 sides", function() {
        var service = getService();
        var result = service.rollDice(6);
        expect(result).toBeGreaterThanOrEqual(1);
        expect(result).toBeLessThanOrEqual(6);
    });

    it("should return a number between 3 and eighteen using rollDice with a number of 6 sides and 3 dice", function() {
        var service = getService();
        var result = service.rollDice(6, 3);
        expect(result).toBeGreaterThanOrEqual(3);
        expect(result).toBeLessThanOrEqual(18);
    });

    
    it("should return a number between 8 and twenty-three using rollDice with a number of 6 sides, 3 dice and a bonus of 5", function() {
        var service = getService();
        var result = service.rollDice(6, 3, 5);
        expect(result).toBeGreaterThanOrEqual(8);
        expect(result).toBeLessThanOrEqual(23);
    });

    it("should return a number between 7 and thirty-five using rollDice with a string of 4d8+3", function() {
        var service = getService();
        var result = service.rollDice('4d8+3');
        expect(result).toBeGreaterThanOrEqual(7);
        expect(result).toBeLessThanOrEqual(35);
    });

    it("should return a number between 7 and thirty-five using rollDice with a string of 4d12-2", function() {
        var service = getService();
        var result = service.rollDice('4d12-2');
        expect(result).toBeGreaterThanOrEqual(2);
        expect(result).toBeLessThanOrEqual(46);
    });

    it("should calculate the correct attack bonus for an enemy", function() {
        var service = getService();

        var enemy = <IEnemy>{
            items: [
                {
                    name: 'Left dagger',
                    bonuses: {
                        attack: 3
                    }
                },
                {
                    name: 'Right dagger',
                    bonuses: {
                        attack: 2
                    }
                }
            ]
        }
        var result = service.calculateBonus(enemy, 'attack');

        expect(result).toBe(5);
    });

    it("should calculate the correct defense bonus for a character", function() {
        var service = getService();

        var character = <ICharacter><unknown>{
            defense: 1,
            items: [
                <IItem>{
                    name: 'Chain mail',
                    bonuses: {
                        defense: 3
                    }
                },
                <IItem>{
                    name: 'Small shield',
                    bonuses: {
                        defense: 2
                    }
                }
            ]
        }
        var result = service.calculateBonus(character, 'defense');
        
        expect(result).toBe(6);
    });

    function getService(game?) {
        return new HelperService(game || GetObjectFactory().GetGame());
    }

    function find(collection, name) {
        return collection.find(l => l.name === name)();
    }
});