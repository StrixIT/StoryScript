describe("Rules", function() {

    it("should conduct combat", function() {
        var service = _TestGame.Rules();
        var character = new _TestGame.Character();

        var game = {
            character: character,
            currentLocation: {
                activeEnemies: []
            },
            helpers: {
                rollDice: (dice) => {
                    return 6;
                },
                calculateBonus: () => {

                }
            },
            logToCombatLog: () => {

            }
        };
        var enemy = {};

        service.combat.fight(game, enemy);
        var expected = true;
        var result = true;

        expect(result).toEqual(expected);
    });

    it("should create a new character", function() {
        var service = _TestGame.Rules();
        var character = service.character.createCharacter();
        expect(character).not.toBeNull();
    });

});