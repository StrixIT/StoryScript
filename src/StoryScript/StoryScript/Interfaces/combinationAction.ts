namespace StoryScript {
    export interface ICombinationAction {
        text: string;
        preposition: string;
        requiresTarget?: boolean
    }
}