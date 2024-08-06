import {beforeAll, describe, expect, test} from "vitest";
import {ServiceFactory} from "storyScript/ServiceFactory.ts";
import {RunGame} from "../../../Games/MyRolePlayingGame/run.ts";

describe('ServiceFactory', function () {

    beforeAll(() => {
        RunGame();
    });
    
    test("should return all services", function () {
        const factory = ServiceFactory.GetInstance();

        let characterService = factory.GetCharacterService();
        expect(characterService).not.toBeNull();

        const combinationService = factory.GetCombinationService();
        expect(combinationService).not.toBeNull();

        const conversationService = factory.GetConversationService();
        expect(conversationService).not.toBeNull();

        const gameService = factory.GetGameService();
        expect(gameService).not.toBeNull();

        const tradeService = factory.GetTradeService();
        expect(tradeService).not.toBeNull();

        const texts = factory.GetTexts();
        expect(texts).not.toBeNull();

        const rules = factory.GetRules();
        expect(rules).not.toBeNull();
    });
})