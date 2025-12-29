import {beforeAll, describe, expect, test} from "vitest";
import {ServiceFactory} from "storyScript/ServiceFactory.ts";
import {initServiceFactory} from "../helpers.ts";

describe('ServiceFactory', function () {

    beforeAll(() => {
        initServiceFactory();
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

        const dataSerializer = factory.GetDataSerializer();
        expect(dataSerializer).not.toBeNull();

        const dataSynchronizer = factory.GetDataSynchronizer();
        expect(dataSynchronizer).not.toBeNull();

        const texts = factory.GetTexts();
        expect(texts).not.toBeNull();

        const rules = factory.GetRules();
        expect(rules).not.toBeNull();

        const game = factory.GetGame();
        expect(game).not.toBeNull();
    });

    test("should return all available locations", function () {
        const factory = ServiceFactory.GetInstance();
        const locations = factory.AvailableLocations;
        expect(locations.length).toBe(5);
    });
})