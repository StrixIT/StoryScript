import { describe, test, expect } from 'vitest';
import { HelperService } from 'storyScript/Services/helperService';
import { IEnemy, ICharacter, IGame, IDefinitions, IItem } from 'storyScript/Interfaces/storyScript';
import { IHelperService } from 'storyScript/Interfaces/services/helperService';

describe("HelperService", function() {

    test("should retrieve a random item", function() {
        const { service } = getService();
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

    test("should retrieve a random enemy", function() {
        const { service } = getService();
        var random = service.randomEnemy();

        var enemyIds = [
            'bandit'
        ];

        expect(random).not.toBe(null);
        expect(enemyIds).toContain(random.id);
    });

    test("should retrieve an item using its id", function() {
        const { service, definitions } = getService();
        var expected = find(definitions.items, 'Sword');

        var getWithId = service.getItem('Sword');

        expect(getWithId).toEqual(expected);
    });

    test("should retrieve an enemy using its id", function() {
        const { service, definitions } = getService();
        const expected: IEnemy = find(definitions.enemies, 'Bandit');
        var getWithId = service.getEnemy('Bandit');
        expect(getWithId).toEqual(expected);
    });

    test("should return a number between 1 and six using rollDice with a number of 6 sides", function() {
        const { service } = getService();
        var result = service.rollDice(6);
        expect(result).toBeGreaterThanOrEqual(1);
        expect(result).toBeLessThanOrEqual(6);
    });

    test("should return a number between 3 and eighteen using rollDice with a number of 6 sides and 3 dice", function() {
        const { service } = getService();
        var result = service.rollDice(6, 3);
        expect(result).toBeGreaterThanOrEqual(3);
        expect(result).toBeLessThanOrEqual(18);
    });
    
    test("should return a number between 8 and twenty-three using rollDice with a number of 6 sides, 3 dice and a bonus of 5", function() {
        const { service } = getService();
        var result = service.rollDice(6, 3, 5);
        expect(result).toBeGreaterThanOrEqual(8);
        expect(result).toBeLessThanOrEqual(23);
    });

    test("should return a number between 7 and thirty-five using rollDice with a string of 4d8+3", function() {
        const { service } = getService();
        var result = service.rollDice('4d8+3');
        expect(result).toBeGreaterThanOrEqual(7);
        expect(result).toBeLessThanOrEqual(35);
    });

    test("should return a number between 7 and fourthy-six using rollDice with a string of 4d12-2", function() {
        const { service } = getService();
        var result = service.rollDice('4d12-2');
        expect(result).toBeGreaterThanOrEqual(2);
        expect(result).toBeLessThanOrEqual(46);
    });

    test("should calculate the correct attack bonus for an enemy", function() {
        const { service } = getService();

        var enemy = <IEnemy>{
            items: <any>[
                {
                    name: 'Left dagger',
                    attack: 3
                },
                {
                    name: 'Right dagger',
                    attack: 2
                }
            ]
        }
        var result = service.calculateBonus(enemy, 'attack');

        expect(result).toBe(5);
    });

    test("should calculate the correct defense bonus for a character", function() {
        const { service } = getService();

        var character = <ICharacter><unknown>{
            defense: 1,
            items: [
                {
                    name: 'Chain mail',
                    defense: 3
                },
                {
                    name: 'Small shield',
                    defense: 2
                }
            ]
        }
        var result = service.calculateBonus(character, 'defense');
        
        expect(result).toBe(6);
    });

});

function getService(): { service: IHelperService, definitions: IDefinitions } {
    const key = function BasementKey() { return <IItem>{ id: 'basementkey'}; };
    const journal = function Journal() { return <IItem>{ id: 'journal' }; };
    const boots = function LeatherBoots() { return <IItem>{ id: 'leatherboots' }; };
    const sword = function Sword() { return <IItem>{ id: 'sword' }; };
    const bandit = function Bandit() { return <IEnemy>{ id: 'bandit' }; };

    const definitions: IDefinitions = {
        items: [
            key,
            journal,
            boots,
            sword
        ],
        enemies: [
            bandit
        ],
        actions: [],
        features: [],
        locations: [],
        persons: [],
        quests: []
    }

    var game = <IGame>{
        definitions: definitions
    };

    return { service: new HelperService(game), definitions: definitions };
}

function find(collection, name) {
    return collection.find(l => l.name === name)();
}