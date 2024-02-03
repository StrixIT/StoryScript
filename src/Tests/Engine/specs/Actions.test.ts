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
        let callBackCalled = false;

        const game = <IGame>{};

        const barrier = <IBarrier>{};

        const destination = <IDestination>{
            barrier: barrier
        };

        const callBack = () => {
            callBackCalled = true;
        };

        Open(callBack)(game, barrier, destination);

        expect(destination.barrier).toBeUndefined();
        expect(callBackCalled).toBeTruthy();
    });

    test("open with key should remove a barrier when the character has the key needed", function() {
        let callBackCalled = false;

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

        const destination = <IDestination>{
            barrier: barrier
        };

        const callBack = () => {
            callBackCalled = true;
        };

        OpenWithKey(callBack)(game, barrier, destination);

        expect(destination.barrier).toBeUndefined();
        expect(callBackCalled).toBeTruthy();
    });

});