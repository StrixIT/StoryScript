module QuestForTheKing {
    export function Location<T extends ILocation>(entity: T): T {
        return StoryScript.Location(entity);
    }

    export interface ILocation extends StoryScript.ILocation {
        destinations?: StoryScript.ICollection<IDestination>;
    }
}