import 'zone.js';
import 'reflect-metadata';
import * as angular from 'angular';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { setAngularLib } from '@angular/upgrade/static';
import { AppModule } from './app.module';

setAngularLib(angular);
platformBrowserDynamic().bootstrapModule(AppModule);