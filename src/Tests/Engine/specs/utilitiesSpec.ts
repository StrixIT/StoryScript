import { getPlural, getSingular, isEmpty } from 'storyScript/utilities';

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
});