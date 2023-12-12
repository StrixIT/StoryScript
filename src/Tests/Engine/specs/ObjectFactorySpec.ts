import { IInterfaceTexts, IRules } from "storyScript/Interfaces/storyScript";
import { ObjectFactory } from "storyScript/ObjectFactory";

describe('ObjectFactory', function () {
    
    it("should return character service", function() {
        var factory = getFactory();
        var service = factory.GetCharacterService();
        expect(service).not.toBeNull();
    });

    it("should return combination service", function() {
        var factory = getFactory();
        var service = factory.GetCombinationService();
        expect(service).not.toBeNull();
    });

    it("should return conversation service", function() {
        var factory = getFactory();
        var service = factory.GetConversationService();
        expect(service).not.toBeNull();
    });

    it("should return game service", function() {
        var factory = getFactory();
        var service = factory.GetGameService();
        expect(service).not.toBeNull();
    });

    it("should return trade service", function() {
        var factory = getFactory();
        var service = factory.GetTradeService();
        expect(service).not.toBeNull();
    });

    it("should return texts", function() {
        var factory = getFactory();
        var texts = factory.GetTexts();
        expect(texts).not.toBeNull();
    });

    it("should return the game rules", function() {
        var factory = getFactory();
        var texts = factory.GetRules();
        expect(texts).not.toBeNull();
    });
})

function getFactory() {
    return new ObjectFactory('', <IRules>{}, <IInterfaceTexts>{});;
}