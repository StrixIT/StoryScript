import 'zone.js';
import 'reflect-metadata';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app.module';
import { enableProdMode } from '@angular/core';

// The production setting is triggered when using the webpack.production config.
if (process.env.NODE_ENV === 'production') {
    enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule);