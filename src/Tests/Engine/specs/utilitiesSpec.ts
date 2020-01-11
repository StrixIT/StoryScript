import { getPlural, getSingular, isEmpty, addHtmlSpaces, custom, equals } from 'storyScript/utilities';

describe("Utilities", function() {

    it("should get the correct plural of enemy", function() {
        var result = getPlural('enemy');
        expect(result).toEqual('enemies');
    });

    it("should get the correct plural of item", function() {
        var result = getPlural('item');
        expect(result).toEqual('items');
    });

    it("should get the correct singular of items", function() {
        var result = getSingular('items');
        expect(result).toEqual('item');
    });

    it("should get the correct singular of items", function() {
        var result = getSingular('enemies');
        expect(result).toEqual('enemy');
    });

    it("should return true when null", function() {
        var result = isEmpty(null);
        expect(result).toEqual(true);
    });

    it("should return true when an object has no properties", function() {
        var result = isEmpty({});
        expect(result).toEqual(true);
    });

    it("should return true when a property is not present", function() {
        var result = isEmpty({}, 'test');
        expect(result).toEqual(true);
    });

    it("should return true when an array is empty", function() {
        var result = isEmpty([]);
        expect(result).toEqual(true);
    });

    it("should return true when a property array is empty", function() {
        var result = isEmpty({ test: []}, 'test');
        expect(result).toEqual(true);
    });

    it("should return false when an object is not undefined, null or empty", function() {
        var result = isEmpty({ test: null });
        expect(result).toEqual(false);
    });

    it("should add spaces when needed", function() {
        var result = addHtmlSpaces('test');
        expect(result).toEqual('&nbsp;test&nbsp;');
    });

    it("equals should return true when id matches function name", function() {
        const Test = () => {
            return { 
                id: ''
            };
        };
        
        const result = equals({ id: 'test' }, Test);

        expect(result).toBeTruthy();
    });

    it("custom should override specified properties on base", function() {

        var baseItem = () => {
            return {
                name: 'Test',
                damage: 5,
                speed: 3
            }
        };

        var result = custom(baseItem, {
            name: 'Override',
            damage: 10
        });

        expect(result.name).toEqual('Override');
        expect(result.damage).toEqual(10);
        expect(result.speed).toEqual(3);
    });

});