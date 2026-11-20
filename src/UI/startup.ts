import {App, createApp} from 'vue';
import {createPinia, Pinia} from 'pinia';
import AppShell from 'ui/Components/AppShell.vue';
import {ServiceFactory} from "src/Engine/ServiceFactory";
import {logTime} from "../StartupLogger";
import {buildEntities, IInterfaceTexts, IRules, useStateStore} from 'storyScript';
import {getDefinitions} from "ui/helpers";

import 'ui/styles/bootstrap-storyscript.scss';
import 'ui/styles/storyscript.css';

export const startup = async (components: Map<string, any>, assets: Record<string, unknown>, gameName: string, rules: IRules, texts: IInterfaceTexts) => {
    let pinia: Pinia;
    let application: App<Element>;

    if (!ServiceFactory.GetInstance()) {
        const definitions = getDefinitions(assets);
        const registeredEntities = buildEntities(definitions);
        new ServiceFactory(gameName, definitions, registeredEntities, rules, texts);
    }

    await logTime('Start Vue', () => {
        pinia = createPinia();
        application = createApp(AppShell);
        application.use(pinia);
    });

    await logTime('Import components', async () => {
        for (const [componentName, component] of components) {
            application.component(componentName, (component as any)?.default);
        }
    });

    const store = useStateStore();
    store.initErrorHandling(application);
    let serviceFactory: ServiceFactory;

    await logTime('Create ServiceFactory', () => {
        serviceFactory = ServiceFactory.GetInstance();
        store.setStoreData(serviceFactory);
    });

    await logTime('Init game', async () => {
        const rules = serviceFactory.GetRules();
        const gameService = serviceFactory.GetGameService();

        if (rules.setup?.titleScreen?.getDemoMode) {
            const demoConfig = rules.setup.titleScreen.getDemoMode();
            await gameService.initDemo(demoConfig);
        } else {
            await gameService.init();
        }
    });

    await logTime('Mount app', () => {
        application.mount('#app');
    });
};