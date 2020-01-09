import { PlayState } from '../Engine/Interfaces/storyScript';
import { IGame } from '../Engine/Interfaces/storyScript';
import { ElementRef } from '@angular/core';

const _templates = new Map<string, string>();
const _playStateWatchers = [];
let _dynamicStyleElements = [];

export function getTemplate(componentName: string, defaultTemplate?: any): string {
    if (_templates.size === 0) {
        var componentRegex = /\/[a-z_A-Z]{2,}\.component\.html$/;
        var r = require.context('game/ui/components', false, /.component.html$/);

        r.keys().map(i => {
            var match = componentRegex.exec(i);

            if (match) {
                _templates.set(match[0].substring(1, match[0].indexOf('.')), r(i).default);
            }
        });
    }

    return _templates.get(componentName) || defaultTemplate?.default;
}

export function watchDynamicStyles(game: IGame,  hostElement: ElementRef<any>) {
    if (_dynamicStyleElements.length === 0) {
        var dynamicStyles = game.dynamicStyles || [];

        Object.defineProperty(game, 'dynamicStyles', {
            enumerable: true,
            get: () => {
                return dynamicStyles;
            },
            set: value => {
                dynamicStyles = value;

                _dynamicStyleElements.forEach(e => {
                    applyDynamicStyling(game, e);
                });
            }
        });
    }

    _dynamicStyleElements = _dynamicStyleElements.filter(e => e.nativeElement.tagName !== hostElement.nativeElement.tagName);
    _dynamicStyleElements.push(hostElement);
}

export function applyDynamicStyling(game: IGame, hostElement: ElementRef<any>) {
    setTimeout(() => {
        game.dynamicStyles.forEach(s => {
            var elements = hostElement.nativeElement.querySelectorAll(s.elementSelector);

            elements.forEach((el: HTMLElement) => {
                var styleText = '';
                s.styles.filter(e => !e[1]).forEach(e => styleText += (styleText ? ' ' + e[0] : e[0]));

                if (styleText) {
                    el.className = styleText;
                }

                s.styles.filter(e => e[1]).forEach(e => styleText += e[0] + ': ' + e[1] + ';' );

                if (styleText) {
                    el.style.cssText = styleText;
                }
            });
        });
    }, 0, false);
}