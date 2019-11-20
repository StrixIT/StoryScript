import { Run } from '../../Engine/run';
import { CustomTexts, Rules } from './interfaces/types';

// Calling this function will bootstrap the game using our game namespace and rules and text objects.
Run('_TestGame', Rules(), CustomTexts());