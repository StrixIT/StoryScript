module QuestForTheKing {
    export interface IDestination extends StoryScript.IDestination {
        activeNight?: boolean;
        activeDay?: boolean;
    }
}