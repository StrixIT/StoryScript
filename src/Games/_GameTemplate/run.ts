import { Run } from 'storyScript/run';
import { CustomTexts, Rules } from './types';

// Calling this function will bootstrap the game using our game namespace and rules and text objects.
Run('GameTemplate', Rules(), CustomTexts());