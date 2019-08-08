namespace DangerousCave {
    export function Item(entity: IItem): IItem {
        return StoryScript.Item(entity);
    }

    export interface IItem extends IFeature, StoryScript.IItem {
        // Add game-specific item properties here
    }
}