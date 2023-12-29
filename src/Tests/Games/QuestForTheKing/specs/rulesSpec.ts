import { HelperService } from "storyScript/Services/helperService";
import { heal } from "../../../../Games/QuestForTheKing/gameFunctions";
import { Character } from "src/Games/QuestForTheKing/types";
import { IGame } from "storyScript/Interfaces/storyScript";

describe("Rules", function() {

    describe("Healing", function() {
        it("should heal specified amount", function() {
            const amount = 5;
            const character = <Character>{
                hitpoints: 20,
                currentHitpoints: 10
            };
            heal(character, amount);


            expect(character.currentHitpoints).toEqual(15);
        });

        it("should not heal more than the amount of hitpoints the character has", function() {
            const amount = 5;
            const character = <Character>{
                hitpoints: 20,
                currentHitpoints: 18
            };
            heal(character, amount);


            expect(character.currentHitpoints).toEqual(20);
        });
    });

});

describe("Helpers", function() {

    it("should return a valid dice result", function() {
        var service = new HelperService(<IGame>{});

        const result = service.rollDice('1d1+2');
        expect(result).toBe(3);
    });

});