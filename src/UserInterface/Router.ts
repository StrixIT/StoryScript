import {createRouter, createWebHashHistory} from 'vue-router';

export enum Routes {
    Main = '/',
    Menu = '/menu',
    Combat = 'Combat',
    Trade = 'Trade',
    Conversation = 'Conversation',
    Description = 'Description'
}

export const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: Routes.Main,
            name: 'Main',
            component: () => import('vue/Views/Main.vue'),
        },
        {
            path: Routes.Menu,
            name: 'Menu',
            component: () => import('vue/Views/Menu.vue'),
        }
    ]
});