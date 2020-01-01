import { PlayState } from '../Engine/Interfaces/storyScript';
import { IGame } from '../Engine/Interfaces/storyScript';

const _playStateWatchers = [];

export function getUserTemplate(componentName: string): string {
    var r = require.context('game/ui/components', false, /.component.html$/);
    let userTemplate = null;

    r.keys().map(i => {
        if (i.endsWith(`${componentName}.component.html`)) {
            userTemplate = r(i).default;
        }
    });

    return userTemplate;
}

export function watchPlayState(game: IGame, callBack: (playState: PlayState) => void) {
    if (_playStateWatchers.length === 0) {
        var playState = game.playState;

        Object.defineProperty(game, 'playState', {
            enumerable: true,
            get: () => {
                return playState;
            },
            set: value => {
                playState = value;
                _playStateWatchers.forEach(w => w(playState));
            }
        });
    }

    if (_playStateWatchers.indexOf(callBack) < 0) {
        _playStateWatchers.push(callBack);
    }
}