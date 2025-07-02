import { describe, expect, test } from "vitest";
import { Location } from "../../../Engine/EntityCreatorFunctions";
import { addArrayExtensions } from "../../../Engine/arrayAndFunctionExtensions";

describe("Features", function () {

    test("should add coordinates to inline feature", function () {
        addArrayExtensions();
        const locationDefinition = function Test() 
        { 
            return {
                name: 'Test',
                description: `<visual-features img="fallenhero.jpg">
                    <area name="passageback" coords="1,1" shape="rect">
                    </visual-features>`,
                features: [{
                    name: 'Passage back',
                    combinations: {
                        combine: [
                            {
                                combinationType: 'Walk',
                                match: (game, target, tool): string => {
                                    return ''
                                }
                            }
                        ]
                    }
                }]
            }
        }

        var location = Location(<any>locationDefinition);
        expect(location.features[0].shape).toBe('rect');
        expect(location.features[0].coords).toBe('1,1');
    });
});