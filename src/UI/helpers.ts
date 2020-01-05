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

export function watchPlayState(game: IGame, callBack: (game: IGame, newPlayState: PlayState, oldPlayState: PlayState) => void) {
    if (_playStateWatchers.length === 0) {
        var playState = game.playState;

        Object.defineProperty(game, 'playState', {
            enumerable: true,
            get: () => {
                return playState;
            },
            set: value => {
                const oldState = playState;
                playState = value;
                _playStateWatchers.forEach(w => w(game, playState, oldState));
            }
        });
    }

    if (_playStateWatchers.indexOf(callBack) < 0) {
        _playStateWatchers.push(callBack);
    }
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

            elements.forEach((e: HTMLElement) => {
                var styleText = '';
                s.styles.forEach(e => styleText += e[0] + ': ' + e[1] + ';' );
                e.style.cssText = styleText;
            });
        });
    }, 0, false);
}