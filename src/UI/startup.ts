import {App, createApp} from 'vue';
import {createPinia, Pinia} from 'pinia';
import AppShell from 'ui/Components/AppShell.vue';
import {ServiceFactory} from "src/Engine/ServiceFactory";
import {logTime} from "../StartupLogger";
import {useStateStore} from "ui/StateStore";

import 'ui/styles/bootstrap-storyscript.scss';
import 'ui/styles/storyscript.css';

export const startup = (components: Map<string, any>) => {

    let pinia: Pinia;
    let application: App<Element>

    logTime('Start Vue', () => {
        pinia = createPinia();
        application = createApp(AppShell);
        application.use(pinia);
    });

    logTime('Import components', async () => {
        for (const [componentName, component] of components) {
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
        const rules = serviceFactory.GetRules();
        const gameService = serviceFactory.GetGameService();

        if (rules.setup?.titleScreen?.getDemoMode) {
            const demoConfig = rules.setup.titleScreen.getDemoMode();
            gameService.initDemo(demoConfig);
        } else {
            gameService.init();
        }
    });

    logTime('Mount app', () => {
        application.mount('#app');
    });
};