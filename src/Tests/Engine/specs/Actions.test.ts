import {beforeAll, describe, expect, test} from 'vitest';
import {IGame} from 'storyScript/Interfaces/game';
import {IBarrier} from 'storyScript/Interfaces/barrier';
import {IDestination} from 'storyScript/Interfaces/destination';
import {Open} from 'storyScript/Actions/open';
import {OpenWithKey} from 'storyScript/Actions/openWithKey';
import {IKey} from 'storyScript/Interfaces/key';
import {addArrayExtensions} from 'storyScript/globalFunctions';

describe("StoryScript Actions", function () {

    beforeAll(() => {
        addArrayExtensions();
    });

    test("open should remove a barrier", function () {
        const game = <IGame>{};
        const barrier = ['Barrier', <IBarrier>{}];

        // Use a test property on destination to verify the callback function
        // is called. The callback is made safe for serialization, so the callback
        // does not have access to the context of this test outside of the parameters
        // passed in to the Open function.
        const destination = <IDestination & { callBackCalled: boolean }>{
            barriers: [barrier]
        };

        const callBack = () => {
            destination.callBackCalled = true;
        };

        Open(callBack)(game, <[string, IBarrier]>barrier, destination);

        expect(destination.barriers.length).toBe(0);
        expect(destination.callBackCalled).toBeTruthy();
    });

    test("open with key should remove a barrier when the character has the key needed", function () {
        const key = () => {
            return <IKey>{
                id: 'testkey',
                keepAfterUse: false
            }
        };

        const game = <IGame>{
            party: {
                characters: [
                    {
                        items: []
                    }
                ]
            },
            currentLocation: {
                items: []
            }
        };

        const barriers = [['Barrier', <IBarrier>{
            key: key
        }]];

        const destination = <IDestination & { callBackCalled: boolean }>{
            barriers: barriers
        };

        const callBack = () => {
            destination.callBackCalled = true;
        };

        OpenWithKey(callBack)(game, <[string, IBarrier]>barriers[0], destination);

        expect(destination.barriers.length).toBe(0);
        expect(destination.callBackCalled).toBeTruthy();
    });

});