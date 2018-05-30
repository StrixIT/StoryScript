module QuestForTheKing {
    export interface ILocation extends StoryScript.ILocation {
        destinations?: StoryScript.ICollection<IDestination>;
    }
}