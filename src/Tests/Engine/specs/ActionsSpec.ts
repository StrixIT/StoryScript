import { IGame } from '../../../Engine/Interfaces/game';
import { IBarrier } from '../../../Engine/Interfaces/barrier';
import { IDestination } from '../../../Engine/Interfaces/destination';
import { Open } from '../../../Engine/Actions/open';
import { OpenWithKey } from '../../../Engine/Actions/openWithKey';
import { IKey } from '../../../Engine/Interfaces/key';

describe("StoryScript Actions", function() {

    it("open should remove a barrier", function() {
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

    it("open with key should remove a barrier when the character has the key needed", function() {
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