module MyNewGame {
    export function custom<T>(definition: () => T, customData: {}) {
        return StoryScript.custom(definition, customData);
    }
}