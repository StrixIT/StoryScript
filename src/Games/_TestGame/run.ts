import { Run } from '../../Engine/run';
import { CustomTexts, Rules } from './interfaces/types';
import { importAssets } from '../../Engine/utilities';

importAssets(require.context('../../Games/_TestGame', true, /[a-zA-Z].ts$/));

// Calling this function will bootstrap the game using our game namespace and rules and text objects.
Run('_TestGame', Rules(), CustomTexts());