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

export class CommandService implements ICommandService {

    constructor(
        private _locationService: ILocationService, 
        private _conversationService: IConversationService,
        private _combinationService: ICombinationService,
        private _dataService: IDataService, 
        private _game: IGame) {
        this._combinationActions = this._combinationService.getCombinationActions();
    }

    private _combinationActions: ICombinationAction[] = [];
    
    go = (location: (() => ILocation) | string, travel?: boolean): void => {
        this._locationService.changeLocation(location, travel, this._game);

        if (travel) {
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
        
        this._combinationService.tryCombination(selectedTarget);
    }

    private getFeature(feature: (() => IFeature) | string) {
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