import '../../../../Games/DangerousCave/run';
import { GetDefinitions, GetFunctions } from 'storyScript/ObjectConstructors';

describe("DangerousCave object registration", function() {

    it("should load all assets, including the ones not used right away", function() {
        var definitions = GetDefinitions();
        var registeredActions = definitions['actions'];

        expect(registeredActions).not.toBeUndefined();
        expect(registeredActions.length).toEqual(5);

        var functions = GetFunctions();
        var registeredFunctions = functions['actions'];

        expect(registeredFunctions).not.toBeUndefined();
        
        var registeredKeys = Object.keys(registeredFunctions);

        expect(registeredKeys.length).toEqual(4);

        expect([
            'flee|status',
            'flee|execute',
            'search|execute',
            'unlock|execute'
        ]).toEqual(registeredKeys);
    });

});