describe("HelperService", function() {

    beforeEach(() => {
        // Trigger object factory initialization.
        StoryScript.ObjectFactory.GetGame();
    });

    it("should retrieve a random item", function() {
        var game = StoryScript.ObjectFactory.GetGame();
        var service = new StoryScript.HelperService(game);
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
        var game = StoryScript.ObjectFactory.GetGame();
        var service = new StoryScript.HelperService(game);
        var random = service.randomEnemy();

        var itemIds = [
            'bandit'
        ];

        expect(random).not.toBe(null);
        expect(itemIds).toContain(random.id);
    });

    it("should retrieve an item using its id", function() {
        var game = StoryScript.ObjectFactory.GetGame();
        var service = new StoryScript.HelperService(game);
        var expected = game.definitions.items.find(l => l.name === 'Sword')();

        var getWithId = service.getItem('Sword');

        expect(getWithId).toEqual(expected);
    });

    it("should retrieve an enemy using its id", function() {
        var game = StoryScript.ObjectFactory.GetGame();
        var service = new StoryScript.HelperService(game);
        var expected = game.definitions.enemies.find(l => l.name === 'Bandit')();

        // Set the action to null because comparing the action function fails.
        expected.items[1].open.action = null;

        var getWithId = service.getEnemy('Bandit');
        getWithId.items[1].open.action = null;

        expect(getWithId).toEqual(expected);
    });

    it("should return a number between 1 and six using rollDice with a number of 6 sides", function() {
        var service = new StoryScript.HelperService();
        var result = service.rollDice(6);
        expect(result).toBeGreaterThanOrEqual(1);
        expect(result).toBeLessThanOrEqual(6);
    });

    it("should return a number between 3 and eighteen using rollDice with a number of 6 sides and 3 dice", function() {
        var service = new StoryScript.HelperService();
        var result = service.rollDice(6, 3);
        expect(result).toBeGreaterThanOrEqual(3);
        expect(result).toBeLessThanOrEqual(18);
    });

    
    it("should return a number between 8 and twenty-three using rollDice with a number of 6 sides, 3 dice and a bonus of 5", function() {
        var service = new StoryScript.HelperService();
        var result = service.rollDice(6, 3, 5);
        expect(result).toBeGreaterThanOrEqual(8);
        expect(result).toBeLessThanOrEqual(23);
    });

    it("should return a number between 7 and thirty-five using rollDice with a string of 4d8+3", function() {
        var service = new StoryScript.HelperService();
        var result = service.rollDice('4d8+3');
        expect(result).toBeGreaterThanOrEqual(7);
        expect(result).toBeLessThanOrEqual(35);
    });

    it("should return a number between 7 and thirty-five using rollDice with a string of 4d12-2", function() {
        var service = new StoryScript.HelperService();
        var result = service.rollDice('4d12-2');
        expect(result).toBeGreaterThanOrEqual(2);
        expect(result).toBeLessThanOrEqual(46);
    });

    it("should calculate the correct attack bonus for an enemy", function() {
        var service = new StoryScript.HelperService();

        var enemy = {
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
        var service = new StoryScript.HelperService();

        var character = {
            defense: 1,
            items: [
                {
                    name: 'Chain mail',
                    bonuses: {
                        defense: 3
                    }
                },
                {
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
});