import {createApp, defineAsyncComponent} from 'vue';
import {createPinia} from 'pinia';
import AppShell from 'vue/Components/AppShell.vue';
import {getTemplate} from "vue/Helpers.ts";

const pinia = createPinia();
const app = createApp(AppShell);

// addEventListener("error", event => {
//     errorRepo.logError(event.message, event.error.stack);
//     event.stopPropagation();
// });
// addEventListener("unhandledrejection", event => {
//     errorRepo.logError(event.reason.message, event.reason.stack);
//     event.stopPropagation();
// });

//app.config.errorHandler = (error: any) => errorRepo.logError(error.message, error.stack);

app.component('Navigation', defineAsyncComponent(() =>
    import(getTemplate('/src/UserInterface/Components', 'Navigation'))
))

app.use(pinia).mount('#app');