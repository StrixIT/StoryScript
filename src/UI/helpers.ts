import { PlayState } from '../Engine/Interfaces/storyScript';
import { IGame } from '../Engine/Interfaces/storyScript';

const _templates = new Map<string, string>();
const _playStateWatchers = [];

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

export function watchPlayState(game: IGame, callBack: (newPlayState: PlayState, oldPlayState: PlayState) => void) {
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
                _playStateWatchers.forEach(w => w(playState, oldState));
            }
        });
    }

    if (_playStateWatchers.indexOf(callBack) < 0) {
        _playStateWatchers.push(callBack);
    }
}