import {IDemoMode} from "storyScript/Interfaces/rules/demoMode.ts";
import {ServiceFactory} from "storyScript/ServiceFactory.ts";

export const  getDemoMode = (serviceFactory: ServiceFactory) => {
    const conversationService = serviceFactory.GetConversationService();
    
    return <IDemoMode>{
        runningDemo: true,
        party: {
            characters: [
                {
                    name: 'Rutger',
                    hitpoints: 10,
                    currentHitpoints: 10,
                    strength: 2,
                    agility: 1,
                    intelligence: 2,
                    equipment: {}
                }
            ]
        },
        startTransitionDelay: '1',
        startInterval: 1000,
        showDemoPlayText: true,
        steps: [{
            action: game => {
                conversationService.talk(game.locations['start'].persons[0]);
            },
            delay: 2000
        },{
            action: game => {
                conversationService.answer(game.person.conversation.activeNode, game.person.conversation.activeNode.replies[0]);
            },
            delay: 1000
        },{
            action: game => {
                conversationService.answer(game.person.conversation.activeNode, game.person.conversation.activeNode.replies[0]);
            },
            delay: 1000
        }, {
            action: game => {
                game.playState = null;
            },
            delay: 1000
        }
        , {
            action: game => {
                game.playState = null;
                game.changeLocation('garden');
            },
            delay: 2000
        }
            
        ]
    };
}