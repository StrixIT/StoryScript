import { describe, beforeAll, test, expect } from 'vitest';
import { IGame } from 'storyScript/Interfaces/game';
import { IBarrier } from 'storyScript/Interfaces/barrier';
import { IDestination } from 'storyScript/Interfaces/destination';
import { Open } from 'storyScript/Actions/open';
import { OpenWithKey } from 'storyScript/Actions/openWithKey';
import { IKey } from 'storyScript/Interfaces/key';
import { addArrayExtensions } from 'storyScript/globals';

describe("StoryScript Actions", function() {

    beforeAll(() => {
        addArrayExtensions();
    });

    test("open should remove a barrier", function() {
        const game = <IGame>{};
        const barrier = <IBarrier>{};

        // Use a test property on destination to verify the callback function
        // is called. The callback is made safe for serialization, so the callback
        // does not have access to the context of this test outside of the parameters
        // passed in to the Open function.
        const destination = <IDestination & { callBackCalled: boolean }>{
            barrier: barrier
        };

        const callBack = () => {
            destination.callBackCalled = true;
        };

        Open(callBack)(game, barrier, destination);

        expect(destination.barrier).toBeUndefined();
        expect(destination.callBackCalled).toBeTruthy();
    });

    test("open with key should remove a barrier when the character has the key needed", function() {
        const key = () => {
            return <IKey>{
                id: 'testkey',
                keepAfterUse: false
            }
        };

        const game = <IGame>{
            character: {
                items: []
            },
            currentLocation: {
                items: []
            }
        };

        const barrier = <IBarrier>{
            key: key
        };

        const destination = <IDestination & { callBackCalled: boolean }>{
            barrier: barrier
        };

        const callBack = () => {
            destination.callBackCalled = true;
        };

        OpenWithKey(callBack)(game, barrier, destination);

        expect(destination.barrier).toBeUndefined();
        expect(destination.callBackCalled).toBeTruthy();
    });

});