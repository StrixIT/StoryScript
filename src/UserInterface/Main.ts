import {App, createApp, defineAsyncComponent} from 'vue';
import {createPinia, Pinia} from 'pinia';
import AppShell from 'vue/Components/AppShell.vue';
import {ServiceFactory} from "storyScript/ServiceFactory.ts";
import {logTime} from "../StartupLogger.ts";
import {useStateStore} from "vue/StateStore.ts";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'ui/styles/storyscript.css';
import 'game/ui/styles/game.css'
import 'game/run';
import {useServices} from "vue/Services.ts";

let pinia: Pinia;
let application: App<Element>

logTime('Start Vue', () => {
    pinia = createPinia();
    application = createApp(AppShell);  
})

// addEventListener("error", event => {
//     errorRepo.logError(event.message, event.error.stack);
//     event.stopPropagation();
// });
// addEventListener("unhandledrejection", event => {
//     errorRepo.logError(event.reason.message, event.reason.stack);
//     event.stopPropagation();
// });

//app.config.errorHandler = (error: any) => errorRepo.logError(error.message, error.stack);

const components = [
    'Collapsible',
    'GameContainer',
    'CreateCharacter',
    'Party',
    'CharacterSheet',
    'Backpack',
    'Equipment',
    'Ground',
    'BuildCharacter',
    'ActionLog',
    'Navigation',
    'LocationText',
    'LocationVisual',
    'LocationMap',
    'Exploration',
    'Sound',
    'Quests',
    'GameMenu',
    'Combat',
    'CombatParticipant',
    'Combinations'
];

logTime('Import components', () => {
    const allComponents = getTemplates();
    allComponents.forEach((v, k) => application.component(k, defineAsyncComponent(() => import(v))));
});

application.use(pinia);

let serviceFactory: ServiceFactory;

logTime('Create ServiceFactory', () => {
    const store = useStateStore();
    serviceFactory = ServiceFactory.GetInstance();
    store.setStoreData(serviceFactory);
});

logTime('Init game', () => {
    const services = useServices();
    const gameService = serviceFactory.GetGameService();
    gameService.init();
    services.setFactory(serviceFactory);
});

application.mount('#app');

function getTemplates(): Map<string, string>{
    const combinedTemplates = new Map<string, any>();
    
    if (!import.meta.env?.VITE_BUILDER) {
        return combinedTemplates;
    }
    
    const defaultTemplates = import.meta.glob('ui/**/*.vue', {eager: true, query: 'raw'});
    const customTemplates = import.meta.glob('game/ui/**/*.vue', {eager: true, query: 'raw'});

    Object.keys(customTemplates).forEach(t => {
        const key = getKey(t);
        
        if (key) {
            combinedTemplates.set(getKey(t), t);
        }
    });

    Object.keys(defaultTemplates).forEach(t => {
        const key = getKey(t);
        
        if (key && !combinedTemplates.has(key)) {
            combinedTemplates.set(key, t);
        }
    });
    
    return combinedTemplates;
}

function getKey(path: string) {
    const capture = path.match(/([a-zA-Z]{1,}).vue$/);
    return capture ? capture[1] : null;
}