import { Run } from '../../Engine/run';
import { CustomTexts, Rules } from './types';
import { importAssets } from '../../Engine/utilities';

importAssets(require.context('../../Games/GameTemplate', true, /[a-zA-Z].ts$/));

// Calling this function will bootstrap the game using our game namespace and rules and text objects.
Run('GameTemplate', Rules(), CustomTexts());