import { Run } from 'storyScript/run';
import { CustomTexts, Rules } from './types';

// This is different from the game template because this is used in the engine tests.
export function RunGame() {
// Calling this function will bootstrap the game using our game namespace and rules and text objects.
    Run('MyRolePlayingGame', Rules(), CustomTexts());
}

RunGame();