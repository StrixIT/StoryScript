import {defineStore} from "pinia";
import {ServiceFactory} from "storyScript/ServiceFactory.ts";
import {IPerson} from "storyScript/Interfaces/person.ts";
import {ITrade} from "storyScript/Interfaces/trade.ts";
import {ICompiledLocation} from "storyScript/Interfaces/compiledLocation.ts";

export const useServices = defineStore('appServices', () => {
    let serviceFactory: ServiceFactory;

    const setFactory = (factory: ServiceFactory) => serviceFactory = factory;
    
    const getSoundService = () => serviceFactory.GetSoundService();

    const getItemService = () =>  serviceFactory.GetItemService();

    const getCombatService = () =>  serviceFactory.GetCombatService();

    const getCharacterService = () =>  serviceFactory.GetCharacterService();

    const getCombinationService = () =>  serviceFactory.GetCombinationService();

    const getGameService = () =>  serviceFactory.GetGameService();

    const getConversationService = () =>  serviceFactory.GetConversationService();

    const getTradeService = () =>  serviceFactory.GetTradeService();
    
    const getDataService = () =>  serviceFactory.GetDataService();

    const trade = (location: ICompiledLocation, trade: IPerson | ITrade): boolean => {
        const locationTrade = <ITrade>trade;

        if (locationTrade && !(<any>locationTrade).type && Array.isArray(locationTrade)) {
            trade = location.trade.find(t => t.id === locationTrade[0]);
        }

        getTradeService().trade(trade);

        // Return true to keep the action button for trade locations.
        return true;
    };
    
    const startCombat = (location: ICompiledLocation, person?: IPerson): void => {
        if (person) {
            // The person becomes an enemy when attacked!
            location.persons.delete(person);
            location.enemies.add(person);
        }
        
        getCombatService().initCombat();
    }
    
    return {
        setFactory,
        getSoundService,
        getItemService,
        getCombatService,
        getCharacterService,
        getConversationService,
        getGameService,
        getTradeService,
        getCombinationService,
        getDataService,
        trade,
        startCombat
    }
});