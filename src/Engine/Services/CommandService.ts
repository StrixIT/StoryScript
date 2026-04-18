import {IGame} from "storyScript/Interfaces/game.ts";
import {ICommandService} from "storyScript/Interfaces/services/commandService.ts";
import {ILocationService} from "storyScript/Interfaces/services/locationService.ts";
import {IConversationService} from "storyScript/Interfaces/services/conversationService.ts";
import {ILocation} from "storyScript/Interfaces/location.ts";
import {IPerson} from "storyScript/Interfaces/person.ts";
import {IDataService} from "storyScript/Interfaces/services/dataService.ts";
import {ICombinationService} from "storyScript/Interfaces/services/combinationService.ts";
import {IFeature} from "storyScript/Interfaces/feature.ts";
import {ICombinationAction} from "storyScript/Interfaces/combinations/combinationAction.ts";
import {getItemFromParty} from "storyScript/Services/sharedFunctions.ts";
import {IAction} from "storyScript/Interfaces/action.ts";
import {IBarrier} from "storyScript/Interfaces/barrier.ts";
import {IDestination} from "storyScript/Interfaces/destination.ts";
import {IBarrierAction} from "storyScript/Interfaces/barrierAction.ts";
import {ITradeService} from "storyScript/Interfaces/services/tradeService.ts";
import {IItem} from "storyScript/Interfaces/item.ts";

export class CommandService implements ICommandService {

    private _combinationActions: ICombinationAction[] = [];

    constructor(
        private _locationService: ILocationService,
        private _conversationService: IConversationService,
        private _tradeService: ITradeService,
        private _combinationService: ICombinationService,
        private _dataService: IDataService,
        private _game: IGame) {
        this._combinationActions = this._combinationService.getCombinationActions();
    }

    go = (location: (() => ILocation) | string, saveProgress?: boolean): void => {
        this._locationService.changeLocation(location, saveProgress, this._game);

        if (saveProgress !== false) {
            this._dataService.saveGame(this._game);
        }
    }

    talk = (person: () => IPerson): void => {
        const partner = this._game.currentLocation.persons.get(person);

        if (!partner) {
            throw new Error(`No person ${person.name} present at location ${this._game.currentLocation.name}!`);
        }

        this._conversationService.talk(partner);
    }

    answer = (node: string, reply?: string): void => {
        node ??= 'default';
        const selectedNode = this._game.person.conversation.nodes.find(n => n.node?.toLowerCase() === node);

        if (!selectedNode) {
            throw new Error(`No node ${node} exists on the conversation with person ${this._game.person.name}!`);
        }

        reply = reply?.toLowerCase();
        const selectedReply = selectedNode.replies.find(r => r.linkToNode?.toLowerCase() == reply || (r.defaultReply && !reply));

        if (!selectedReply) {
            throw new Error(`No reply ${reply} exists on conversation node ${node} of person ${this._game.person.name}!`);
        }

        this._conversationService.answer(selectedNode, selectedReply);
    }

    selectCombination = (combination: string): void => {
        const selectedCombination = this.getCombination(combination);
        this._combinationService.setActiveCombination(selectedCombination);
    }

    setTool = (feature: (() => IFeature) | string): void => {
        const selectedTool = this.getFeature(feature);

        if (!selectedTool) {
            throw new Error(`No feature ${typeof feature === 'function' ? feature.name : feature} was found to set as tool!`);
        }

        this._combinationService.tryCombination(selectedTool);
    }

    combine = (combination: string, target: (() => IFeature) | string, tool?: (() => IFeature) | string): void => {
        const selectedCombination = this.getCombination(combination);
        const selectedTarget = this.getFeature(target);

        if (!selectedTarget) {
            throw new Error(`No target feature ${typeof target === 'function' ? target.name : target} was found to try combination ${combination}!`);
        }

        const selectedTool = tool ? this.getFeature(tool) : null;

        if (tool && !selectedTool) {
            throw new Error(`No tool feature ${typeof tool === 'function' ? tool.name : tool} was found to try combination ${combination}!`);
        }

        this._game.combinations.activeCombination = {
            selectedCombinationAction: selectedCombination,
            selectedTool: selectedTool
        }

        this._game.combinations.tryCombine(selectedTarget);
    }
    
    useAction = (action: string | [string, IAction]): void => {
        const selectedAction = typeof action === 'string' ? this._game.currentLocation.actions.get(action) : action;

        if (!selectedAction) {
            throw new Error(`Action ${action} is not present at location ${this._game.currentLocation.name}!`);
        }
        
        this._locationService.executeAction(selectedAction);
        this._dataService.saveGame(this._game)
    }

    useBarrierAction = (destination: string | IDestination, barrier: string | [string, IBarrier], action: string | [string, IBarrierAction]): void => {
        const selectedDestination = typeof destination === 'string' ? this._game.currentLocation.destinations.get(destination) : destination;

        if (!selectedDestination) {
            throw new Error(`Destination ${destination} is not present at location ${this._game.currentLocation.name}!`);
        }

        const selectedBarrier = typeof barrier === 'string' ? selectedDestination.barriers.get(barrier) : barrier;

        if (!selectedBarrier) {
            throw new Error(`Barrier ${barrier} is not present on destination ${selectedDestination.name}!`);
        }
        
        const selectedAction = typeof action === 'string' ? selectedBarrier[1].actions.get(action) : action;

        if (!selectedAction) {
            throw new Error(`Action ${action} is not present at barrier ${selectedBarrier[0]}!`);
        }

        selectedAction[1].execute(this._game, selectedBarrier, selectedDestination);
        selectedBarrier[1].actions.delete(selectedBarrier[1].actions.find(([k, _]) => k === action[0]));
        this._dataService.saveGame(this._game)
    }

    trade = (trade: string | (() => IPerson)): void => {
        const partner = this._game.currentLocation.trade.get(trade);

        if (!partner) {
            const tradeName = typeof trade === 'string' ? trade : trade.name;
            throw new Error(`No trade ${tradeName} present at location ${this._game.currentLocation.name}!`);
        }

        this._tradeService.trade(partner);
    }
    
    buy = (item: (() => IItem)): void => {
        const selectedItem = this._game.trade.buy.items.get(item);

        if (!selectedItem) {
            throw new Error(`Trader ${this._game.trade.name} does not have item ${item.name} for sale!`);
        }
        
        this._tradeService.buy(selectedItem, this._game.trade);
    }

    sell = (item: (() => IItem)): void => {
        const selectedItem = this._game.trade.sell.items.get(item);

        if (!selectedItem) {
            throw new Error(`Item ${item.name} is not available or cannot be sold to ${this._game.trade.name}!`);
        }

        this._tradeService.sell(selectedItem, this._game.trade);
    }

    private getFeature(feature: (() => IFeature) | string) {
        if (typeof feature === 'string') {
            feature = feature.toLowerCase().replace(/\s/g, '');
        }
        
        let selectedFeature = this._game.currentLocation.features.get(feature);
        selectedFeature ??= this._game.currentLocation.persons.get(<any>feature);
        selectedFeature ??= this._game.currentLocation.enemies.get(<any>feature);
        selectedFeature ??= getItemFromParty(this._game.party, <any>feature);
        return selectedFeature;
    }

    private getCombination = (combination: string) => {
        const selectedCombination = this._combinationActions.find(c => c.text.toLowerCase() === combination.toLowerCase());

        if (!selectedCombination) {
            throw new Error(`Combination ${combination} is not defined!`);
        }

        return selectedCombination;
    }
}