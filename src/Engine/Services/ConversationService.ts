import {IGame} from '../Interfaces/game';
import {IPerson} from '../Interfaces/person';
import {IItem} from '../Interfaces/item';
import {IQuest} from '../Interfaces/quest';
import {IConversationService} from '../Interfaces/services/conversationService';
import {PlayState} from '../Interfaces/enumerations/playState';
import {IConversationNode} from '../Interfaces/conversations/conversationNode';
import {IConversationReply} from '../Interfaces/conversations/conversationReply';
import {IConversation} from '../Interfaces/conversations/conversation';
import {checkAutoplay, parseGamePropertiesInTemplate} from './sharedFunctions';
import {compareString} from "storyScript/utilityFunctions.ts";
import {getParsedDocument} from "storyScript/EntityCreatorFunctions.ts";

export class ConversationService implements IConversationService {
    constructor(private readonly _game: IGame) {
    }

    talk = (person: IPerson): void => {
        this.loadConversation(person);
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
        
        if (reply.questStart) {
            this.questProgress('questStart', person, reply);
        }

        if (reply.questComplete) {
            this.questProgress('questComplete', person, reply);
        }
        
        this.processReply(person, reply);
    }

    private readonly loadConversation = (person: IPerson): void => {
        if (person.conversation && !person.conversation.nodes) {
            person.conversation.actions ??= [];
            const conversationElement = getParsedDocument('conversation', person.description)[0];
            const defaultReply = this.getDefaultReply(conversationElement, person);
            const conversationNodes = conversationElement.getElementsByTagName('node');

            person.conversation.nodes = [];
            this.processConversationNodes(conversationNodes, person, defaultReply);
            this.checkNodes(person);

            const nodeToSelect = person.conversation.nodes.filter(n => person.conversation.activeNode && n.node === person.conversation.activeNode.node);
            person.conversation.activeNode = nodeToSelect.length === 1 ? nodeToSelect[0] : null;
        }
    }

    private readonly initConversation = (person: IPerson): void => {
        this._game.person = person;
        const activeNode = this.getActiveNode(person);

        if (!activeNode) {
            return;
        }

        activeNode.lines = checkAutoplay(this._game, activeNode.lines);
        person.conversation.activeNode = activeNode;

        this.initReplies(person);
        this.setReplyStatus(person.conversation, activeNode);
        this.executeAction(activeNode.trigger, person);
    }

    private readonly getDefaultReply = (conversationElement: Element, person: IPerson): string => {
        const defaultReplyNodes = conversationElement.getElementsByTagName('default-reply');
        let defaultReply: string = null;

        if (defaultReplyNodes.length > 1) {
            throw new Error('More than one default reply in conversation for person ' + person.id + '.');
        } else if (defaultReplyNodes.length === 1) {
            defaultReply = defaultReplyNodes[0].innerHTML.trim();
        }

        return defaultReply;
    }

    private readonly processConversationNodes = (conversationNodes: HTMLCollectionOf<Element>, person: IPerson, defaultReply: string) => {
        for (const element of conversationNodes) {
            const newNode = this.getNewNode(person, element);
            this.processReplyNodes(person, element, newNode, defaultReply);

            if (!newNode.replies && defaultReply) {
                newNode.replies = [
                    {
                        defaultReply: true,
                        lines: defaultReply
                    }
                ]
            }

            newNode.lines = parseGamePropertiesInTemplate(element.innerHTML.trim(), this._game);
            person.conversation.nodes.push(newNode);
        }
    }

    private readonly getNewNode = (person: IPerson, node: Element): IConversationNode => {
        let nameAttribute = this.GetNodeValue(node, 'name');

        if (!nameAttribute && console) {
            console.log('Missing name attribute on node for conversation for person ' + person.id + '. Using \'default\' as default name');
            nameAttribute = 'default';
        }

        if (person.conversation.nodes.some((node) => {
            return node.node == nameAttribute;
        })) {
            throw new Error('Duplicate nodes with name ' + nameAttribute + ' for conversation for person ' + person.id + '.');
        }

        return <IConversationNode>{
            node: nameAttribute,
            trigger: this.GetNodeValue(node, 'trigger'),
            lines: '',
            replies: null
        };
    }

    private readonly processReplyNodes = (person: IPerson, node: Element, newNode: IConversationNode, defaultReply: string): void => {
        for (const replies of node.childNodes) {
            if (compareString(replies.nodeName, 'replies')) {
                newNode.replies = [];
                const addDefaultValue = this.GetNodeValue(replies, 'default-reply');
                const addDefaultReply = !compareString(addDefaultValue, 'false');
                this.buildReplies(person, newNode, replies);
                node.removeChild(replies);

                if (defaultReply && addDefaultReply) {
                    newNode.replies.push(<IConversationReply>{
                        lines: parseGamePropertiesInTemplate(defaultReply, this._game)
                    });
                }
            }
        }
    }

    private readonly buildReplies = (person: IPerson, newNode: IConversationNode, replies: ChildNode): void => {
        for (const replyNode of replies.childNodes) {
            if (compareString(replyNode.nodeName, 'reply')) {
                const requires = this.GetNodeValue(replyNode, 'requires');
                const linkToNode = this.GetNodeValue(replyNode, 'node');
                const trigger = this.GetNodeValue(replyNode, 'trigger');
                const questStart = this.GetNodeValue(replyNode, 'quest-start');
                const questComplete = this.GetNodeValue(replyNode, 'quest-complete');
                const setStart = this.GetNodeValue(replyNode, 'set-start');

                if (trigger && !person.conversation.actions.some(([k, _]) => k === trigger)) {
                    console.log('No action ' + trigger + ' for node ' + newNode.node + ' found.');
                }

                const reply = <IConversationReply>{
                    requires: requires,
                    linkToNode: linkToNode,
                    trigger: trigger,
                    questStart: questStart,
                    questComplete: questComplete,
                    setStart: setStart,
                    lines: parseGamePropertiesInTemplate((<any>replyNode).innerHTML.trim(), this._game)
                };

                newNode.replies.push(reply);
            }
        }
    }

    private readonly checkNodes = (person: IPerson): void => {
        person.conversation.nodes.forEach(n => {
            if (n.replies) {
                n.replies.forEach(r => {
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

    private readonly GetNodeValue = (node: Node, attribute: string): string => (<any>node).attributes[attribute]?.value

    private readonly getActiveNode = (person: IPerson): IConversationNode => {
        if (!person?.conversation) {
            return null;
        }

        const conversation = person.conversation;
        let activeNode = conversation.activeNode;

        if (!activeNode) {
            activeNode = conversation.selectActiveNode ? conversation.selectActiveNode(this._game, person) : null;
        }

        if (!activeNode) {
            activeNode = conversation.nodes.filter((node) => {
                return compareString(node.node, person.conversation.startNode);
            })[0];
        }

        if (!activeNode) {
            activeNode = conversation.nodes[0];
        }

        return activeNode;
    }

    private readonly initReplies = (person: IPerson): void => {
        const activeNode = person.conversation.activeNode;

        activeNode.replies.forEach(reply => {
            if (reply.linkToNode) {
                if (!person.conversation.nodes.some((node) => {
                    return node.node === reply.linkToNode;
                })) {
                    console.log('No node ' + reply.linkToNode + ' found to link to for reply ' + reply.lines + '!');
                }
            }

            if (reply.requires) {
                reply.available = this.checkReplyAvailability(activeNode, reply);
            }
        });
    }

    private readonly processReply = (person: IPerson, reply: IConversationReply) => {
        this.executeAction(reply.trigger, person);

        if (reply.setStart) {
            const startNode = person.conversation.nodes.filter((node) => {
                return node.node == reply.setStart;
            })[0];
            person.conversation.startNode = startNode.node;
        }

        let activeNode = null;

        if (reply.linkToNode) {
            activeNode = person.conversation.nodes.filter((node) => {
                return node.node == reply.linkToNode;
            })[0];
            person.conversation.activeNode = activeNode;
            this.executeAction(activeNode.trigger, person);
            this.setReplyStatus(person.conversation, activeNode);
        } else {
            person.conversation.activeNode = null;
        }

        if (!activeNode?.lines) {
            return;
        }

        activeNode!.lines = checkAutoplay(this._game, activeNode!.lines);
    }

    private readonly executeAction = (key: string, person: IPerson) => {
        const action = key ? person.conversation.actions.find(([k, _]) => k === key)?.[1] : null;
        action?.(this._game, person);
    }

    private readonly checkReplyAvailability = (activeNode: IConversationNode, reply: IConversationReply): boolean => {
        let isAvailable = true;
        const requirements = reply.requires.split(',');

        for (const m in requirements) {
            const requirement = requirements[m];
            const values = requirement.toLowerCase().trim().split('=');
            const type = values[0];
            const value = values[1];

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

    private readonly checkReplyRequirements = (activeNode: IConversationNode, type: string, value: string): boolean => {
        let isAvailable: boolean;

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
                        for (const i in c.equipment) {
                            const slotItem = <IItem>c.equipment[i];
                            hasItem = slotItem && compareString(slotItem.id, value);
                        }
                    }
                });

                isAvailable = !!hasItem;
            }
                break;
            case 'location': {
                // Check location visited
                const location = this._game.locations.get(value);

                if (!location) {
                    console.log('Invalid location ' + value + ' for reply requirement for node ' + activeNode.node + '!');
                }

                isAvailable = location.hasVisited === true;
            }
                break;
            case 'quest-start':
            case 'quest-done':
            case 'quest-complete': {
                // Check quest start, quest done or quest complete.
                const quest = this._game.party.quests.get(value);
                
                if (quest) {
                    if (type === 'quest-start') {
                        isAvailable = true;
                    }
                    else if (type === 'quest-done') {
                        isAvailable = quest.checkDone(this._game, quest);
                    } else { 
                        isAvailable = quest.completed;
                    }
                }
            }
                break;
            default: {
                // Check attributes
                const attribute = this._game.activeCharacter[type];

                if (!attribute) {
                    console.log('Invalid attribute ' + type + ' for reply requirement for node ' + activeNode.node + '!');
                }

                isAvailable = isNaN(attribute) ? attribute === value : parseInt(attribute) >= parseInt(value);
            }
                break;
        }

        return isAvailable;
    }

    private readonly setReplyStatus = (conversation: IConversation, node: IConversationNode): void => {
        node.replies?.forEach(reply => {
            if (reply.available == undefined) {
                reply.available = true;
            }
            if (reply.showWhenUnavailable == undefined) {
                reply.showWhenUnavailable = conversation.showUnavailableReplies;
            }
        });
    }

    private readonly questProgress = (type: string, person: IPerson, reply: IConversationReply): void => {
        let quest: IQuest;
        const start = type === 'questStart';

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
        } else {
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