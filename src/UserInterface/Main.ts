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

let pinia: Pinia;
let application: App<Element>
let _templates = <Map<string, string>>null;

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
    'GameContainer',
    'Party',
    'CharacterSheet',
    'Backpack',
    'Equipment',
    'Ground',
    'BuildCharacter',
    'ActionLog',
    'Navigation',
    'LocationText',
    'Exploration',
    'Sound',
    'Quests',
    'GameMenu',
    'Combat',
    'CombatParticipant'
];

const getTemplate = (root: string, componentName: string): string => {
    if (!_templates) {
        _templates = new Map<string, string>();

        if (import.meta.env?.VITE_BUILDER) {
            const modules = import.meta.glob('game/ui/**/*.vue', {eager: true, query: 'raw'});

            for (const path in modules) {
                const capture = path.match(/([a-zA-Z]{1,}).vue$/);
                _templates.set(capture[1], path);
            }
        }
    }

    return _templates.get(componentName) ?? import.meta.resolve(`${root}/${componentName}.vue`);
}

logTime('Import components', () => {
    components.forEach(c => application.component(c, defineAsyncComponent(() => import(getTemplate('/src/UserInterface/Components', c)))));
});

application.use(pinia);

let serviceFactory: ServiceFactory;

logTime('Create ServiceFactory', () => {
    const store = useStateStore();
    serviceFactory = ServiceFactory.GetInstance();
    store.setStoreData(serviceFactory);
});

logTime('Init game', () => {
    const gameService = serviceFactory.GetGameService();
    gameService.init();
});

application.mount('#app')