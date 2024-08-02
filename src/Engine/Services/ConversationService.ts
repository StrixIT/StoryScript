import { IGame } from '../Interfaces/game';
import { IPerson } from '../Interfaces/person';
import { IItem } from '../Interfaces/item';
import { IQuest } from '../Interfaces/quest';
import { compareString } from '../globalFunctions';
import { IConversationService } from '../Interfaces/services/conversationService';
import { PlayState } from '../Interfaces/enumerations/playState';
import { IConversationNode } from '../Interfaces/conversations/conversationNode';
import { IConversationReply } from '../Interfaces/conversations/conversationReply';
import { IConversationReplies } from '../Interfaces/conversations/conversationReplies';
import { IConversation } from '../Interfaces/conversations/conversation';
import { getParsedDocument, checkAutoplay } from './sharedFunctions';
import { parseGameProperties } from 'storyScript/utilityFunctions';

export class ConversationService implements IConversationService {
    constructor(private _game: IGame) {
    }

    talk = (person: IPerson): void => {
        this.loadConversations();
        this.initConversation(person);
        this._game.playState = PlayState.Conversation;
    }

    answer = (node: IConversationNode, reply: IConversationReply): void => {
        const person = this._game.person;

        person.conversation.conversationLog ??= [];

        person.conversation.conversationLog.push({
            lines: checkAutoplay(this._game, node.lines),
            reply: reply.lines
        });

        this.processReply(person, reply);

        var questProgress = reply.questStart || reply.questComplete;

        if (questProgress) {
            var status = reply.questStart ? 'questStart' : 'questComplete';
            this.questProgress(status, person, reply);
        }
    }

    getLines = (nodeOrReply: IConversationNode | IConversationReply): string => {
        if (nodeOrReply && nodeOrReply.lines) {
            return nodeOrReply.lines;
        }

        return null;
    }

    private loadConversations = (): void => {
        const persons = this._game.currentLocation && this._game.currentLocation.persons;

        if (!persons) {
            return;
        }

        persons.filter(p => p.conversation && !p.conversation.nodes).forEach((person) => {
            const descriptionKey = `person_${person.id}`;
            const conversationElement = getParsedDocument('conversation', person.description)[0];
            const defaultReply = this.getDefaultReply(conversationElement, person);
            const conversationNodes = conversationElement.getElementsByTagName('node');

            person.conversation.nodes = [];
            this.processConversationNodes(conversationNodes, person, defaultReply);
            this.checkNodes(person);

            const nodeToSelect = person.conversation.nodes.filter(n => person.conversation.activeNode && n.node === person.conversation.activeNode.node);
            person.conversation.activeNode = nodeToSelect.length === 1 ? nodeToSelect[0] : null;
        });
    }

    private initConversation(person: IPerson): void {
        this._game.person = person;
        var activeNode = this.getActiveNode(person);

        if (!activeNode) {
            return;
        }

        activeNode.lines = checkAutoplay(this._game, activeNode.lines);
        person.conversation.activeNode = activeNode;

        this.initReplies(person);
        this.setReplyStatus(person.conversation, activeNode);
        this.executeAction(activeNode.trigger, person);
    }

    private getDefaultReply = (conversationElement: Element, person: IPerson): string => {
        var defaultReplyNodes = conversationElement.getElementsByTagName('default-reply');
        var defaultReply: string = null;

        if (defaultReplyNodes.length > 1) {
            throw new Error('More than one default reply in conversation for person ' + person.id + '.');
        }
        else if (defaultReplyNodes.length === 1) {
            defaultReply = defaultReplyNodes[0].innerHTML.trim();
        }

        return defaultReply;
    }

    private processConversationNodes = (conversationNodes: HTMLCollectionOf<Element>, person: IPerson, defaultReply: string) => {
        for (var i = 0; i < conversationNodes.length; i++) {
            var node = conversationNodes[i];
            var newNode = this.getNewNode(person, node);

            this.processReplyNodes(person, node, newNode, defaultReply);

            if (!newNode.replies && defaultReply) {
                newNode.replies = {
                    defaultReply: true,
                    options: [
                        {
                            lines: defaultReply
                        }
                    ]
                };
            }

            newNode.lines = parseGameProperties(node.innerHTML.trim(), this._game);;
            person.conversation.nodes.push(newNode);
        }
    }

    private getNewNode = (person: IPerson, node: Element): IConversationNode => {
        var nameAttribute = this.GetNodeValue(node, 'name');

        if (!nameAttribute && console) {
            console.log('Missing name attribute on node for conversation for person ' + person.id + '. Using \'default\' as default name');
            nameAttribute = 'default';
        }

        if (person.conversation.nodes.some((node) => { return node.node == nameAttribute; })) {
            throw new Error('Duplicate nodes with name ' + name + ' for conversation for person ' + person.id + '.');
        }

        return <IConversationNode>{
            node: nameAttribute,
            trigger: this.GetNodeValue(node, 'trigger'),
            lines: '',
            replies: null,
        };
    }

    private processReplyNodes = (person: IPerson, node: Element, newNode: IConversationNode, defaultReply: string): void => {
        for (var j = 0; j < node.childNodes.length; j++) {
            var replies = node.childNodes[j];

            if (compareString(replies.nodeName, 'replies')) {
                var addDefaultValue = this.GetNodeValue(replies, 'default-reply');
                var addDefaultReply = compareString(addDefaultValue, 'false') ? false : true;

                newNode.replies = <IConversationReplies>{
                    defaultReply: <boolean>addDefaultReply,
                    options: []
                };

                this.buildReplies(person, newNode, replies);
                node.removeChild(replies);

                if (defaultReply && newNode.replies.defaultReply) {
                    newNode.replies.options.push(<IConversationReply>{
                        lines: parseGameProperties(defaultReply, this._game)
                    });
                }
            }
        }
    }

    private buildReplies = (person: IPerson, newNode: IConversationNode, replies: ChildNode): void => {
        for (var k = 0; k < replies.childNodes.length; k++) {
            var replyNode = replies.childNodes[k];

            if (compareString(replyNode.nodeName, 'reply')) {
                var requires = this.GetNodeValue(replyNode, 'requires');
                var linkToNode = this.GetNodeValue(replyNode, 'node');
                var trigger = this.GetNodeValue(replyNode, 'trigger');
                var questStart = this.GetNodeValue(replyNode, 'quest-start');
                var questComplete = this.GetNodeValue(replyNode, 'quest-complete');
                var setStart = this.GetNodeValue(replyNode, 'set-start');

                if (trigger && !person.conversation.actions.some(([k, v]) => k === trigger)) {
                    console.log('No action ' + trigger + ' for node ' + newNode.node + ' found.');
                }

                var reply = <IConversationReply>{
                    requires: requires,
                    linkToNode: linkToNode,
                    trigger: trigger,
                    questStart: questStart,
                    questComplete: questComplete,
                    setStart: setStart,
                    lines: parseGameProperties((<any>replyNode).innerHTML.trim(), this._game)
                };

                newNode.replies.options.push(reply);
            }
        }
    }

    private checkNodes = (person: IPerson): void => {
        person.conversation.nodes.forEach(n => {
            if (n.replies && n.replies.options)
            {
                n.replies.options.forEach(r => {
                    if (r.linkToNode && !person.conversation.nodes.some(n => n.node === r.linkToNode)) {
                        console.log('No node ' + r.linkToNode + ' to link to found for node ' + n.node + '.');
                    }

                    if (r.setStart && !person.conversation.nodes.some(n => n.node === r.setStart)) {
                        console.log('No new start node ' + r.setStart + ' found for node ' + n.node + '.');
                    }
                });
            }
        });
    }

    private GetNodeValue = (node: Node, attribute: string): string => (<any>node).attributes[attribute] && (<any>node).attributes[attribute].value

    private getActiveNode = (person: IPerson): IConversationNode => {
        if (!person || !person.conversation) {
            return null;
        }

        var conversation = person.conversation;
        var activeNode = conversation.activeNode;

        if (!activeNode) {
            activeNode = conversation.selectActiveNode ? conversation.selectActiveNode(this._game, person) : null;
        }

        if (!activeNode) {
            activeNode = conversation.nodes.filter((node) => { return compareString(node.node, person.conversation.startNode); })[0];
        }

        if (!activeNode) {
            activeNode = conversation.nodes[0];
        }

        return activeNode;
    }

    private initReplies = (person: IPerson): void => {
        var activeNode = person.conversation.activeNode;

        if (activeNode.replies) {
            for (var n in activeNode.replies.options) {
                var reply = activeNode.replies.options[n];

                if (reply.linkToNode) {
                    if (!person.conversation.nodes.some((node) => { return node.node === reply.linkToNode; })) {
                        console.log('No node ' + reply.linkToNode + ' found to link to for reply ' + reply.lines + '!');
                    }
                }

                if (reply.requires) {
                    reply.available = this.checkReplyAvailability(activeNode, reply);
                }
            }
        }
    }

    private processReply = (person: IPerson, reply: IConversationReply) => {
        this.executeAction(reply.trigger, person);
        
        if (reply.setStart) {
            const startNode = person.conversation.nodes.filter((node) => { return node.node == reply.setStart; })[0];
            person.conversation.startNode = startNode.node;
        }

        let activeNode = null;

        if (reply.linkToNode) {
            activeNode = person.conversation.nodes.filter((node) => { return node.node == reply.linkToNode; })[0];
            person.conversation.activeNode = activeNode;
            this.executeAction(activeNode.trigger, person);
            this.setReplyStatus(person.conversation, activeNode);
        }
        else {
            person.conversation.activeNode = null;
        }

        if (activeNode?.lines) {
            activeNode.lines = checkAutoplay(this._game, activeNode.lines);
        }
    }
    
    private executeAction = (key, person) => {
        const action = key ? person.conversation.actions.find(([k, v]) => k === key)?.[1] : null;
        action?.(this._game, person);
    }

    private checkReplyAvailability = (activeNode: IConversationNode, reply: IConversationReply) : boolean => {
        var isAvailable = true;
        var requirements = reply.requires.split(',');

        for (var m in requirements) {
            var requirement = requirements[m];
            var values = requirement.toLowerCase().trim().split('=');
            var type = values[0];
            var value = values[1];

            if (!type || !value) {
                console.log('Invalid reply requirement for node ' + activeNode.node + '!');
            }

            isAvailable = this.checkReplyRequirements(activeNode, type, value);

            if (!isAvailable) {
                break;
            }
        }

        return isAvailable;
    }

    private checkReplyRequirements = (activeNode: IConversationNode, type: string, value: string): boolean => {
        var isAvailable = true;

        switch (type) {
            case 'item': {
                // Check item available. Item list first, equipment second.
                let hasItem = false;

                this._game.party.characters.forEach(c => {
                    if (hasItem) {
                        return;
                    }

                    hasItem = c.items.get(value) != undefined;

                    if (!hasItem) {
                        for (var i in c.equipment) {
                            var slotItem = <IItem>c.equipment[i];
                            hasItem = slotItem != undefined && slotItem != null && compareString(slotItem.id, value);
                        }
                    }
                });

                isAvailable = hasItem;
            } break;
            case 'location': {
                // Check location visited
                var location = this._game.locations.get(value);

                if (!location) {
                    console.log('Invalid location ' + value + ' for reply requirement for node ' + activeNode.node + '!');
                }

                isAvailable = location.hasVisited === true;
            } break;
            case 'quest-start':
            case 'quest-done':
            case 'quest-complete': {
                // Check quest start, quest done or quest complete.
                var quest = this._game.party.quests.get(value);
                isAvailable = quest != undefined &&
                    (type === 'quest-start' ? true : type === 'quest-done' ?
                        quest.checkDone(this._game, quest) : quest.completed);
            } break;
            default: {
                // Check attributes
                var attribute = this._game.activeCharacter[type];

                if (!attribute) {
                    console.log('Invalid attribute ' + type + ' for reply requirement for node ' + activeNode.node + '!');
                }

                isAvailable = isNaN(attribute) ? attribute === value : parseInt(attribute) >= parseInt(value);
            } break;
        }

        return isAvailable;
    }

    private setReplyStatus = (conversation: IConversation, node: IConversationNode): void => {
        if (node.replies && node.replies.options) {
            node.replies.options.forEach(reply => {
                if (reply.available == undefined) {
                    reply.available = true;
                }
                if (reply.showWhenUnavailable == undefined) {
                    reply.showWhenUnavailable = conversation.showUnavailableReplies;
                }
            });
        }
    }

    private questProgress = (type: string, person: IPerson, reply: IConversationReply): void => {
        var quest: IQuest;
        var start = type === 'questStart';

        if (start) {
            quest = person.quests.get(reply[type]);

            if (!quest.started) {
                quest.issuedBy = person.id;
                person.quests.delete(quest);
                this._game.party.quests.add(quest);
                quest.progress = quest.progress || {};

                if (quest.start) {
                    quest.start(this._game, quest, person);
                }

                quest.started = true;
                quest.completed = false;
            }
        }
        else {
            quest = this._game.party.quests.get(reply[type]);

            if (!quest.completed) {
                if (quest.complete) {
                    quest.complete(this._game, quest, person);
                }

                quest.completed = true;
            }
        }
    }
}