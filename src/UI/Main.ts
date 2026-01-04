import {App, createApp} from 'vue';
import {createPinia, Pinia} from 'pinia';
import AppShell from 'ui/Components/AppShell.vue';
import {ServiceFactory} from "storyScript/ServiceFactory.ts";
import {logTime} from "../StartupLogger.ts";
import {useStateStore} from "ui/StateStore.ts";

import 'ui/styles/bootstrap-storyscript.scss';
import 'ui/styles/storyscript.css';
import 'game/ui/styles/game.css'
import 'game/run';

let pinia: Pinia;
let application: App<Element>

logTime('Start Vue', () => {
    pinia = createPinia();
    application = createApp(AppShell);
    application.use(pinia);
});

logTime('Import components', async () => {
    const allComponents = getComponents();

    for (const [componentName, component] of allComponents) {
        application.component(componentName, (component as any)?.default);
    }
});

const store = useStateStore();
store.initErrorHandling(application);
let serviceFactory: ServiceFactory;

logTime('Create ServiceFactory', () => {
    serviceFactory = ServiceFactory.GetInstance();
    store.setStoreData(serviceFactory);
});

logTime('Init game', () => {
    serviceFactory.GetGameService().init();
});

logTime('Mount app', () => {
    application.mount('#app');
});

function getComponents(): Map<string, any> {
    const combinedTemplates = new Map<string, any>();

    if (!import.meta.env?.VITE_BUILDER) {
        return combinedTemplates;
    }

    const defaultTemplates = import.meta.glob('ui/**/*.vue', {eager: true});
    const customTemplates = import.meta.glob('game/ui/**/*.vue', {eager: true});

    Object.keys(customTemplates).forEach(t => {
        const key = getKey(t);

        if (key) {
            combinedTemplates.set(getKey(t), customTemplates[t]);
        }
    });

    Object.keys(defaultTemplates).forEach(t => {
        const key = getKey(t);

        if (key && !combinedTemplates.has(key)) {
            combinedTemplates.set(key, defaultTemplates[t]);
        }
    });

    return combinedTemplates;
}

function getKey(path: string) {
    const capture = path.match(/([a-zA-Z]{1,}).vue$/);
    return capture ? capture[1] : null;
}