namespace RidderMagnus {
    export function Item(entity: IItem): IItem {
        return StoryScript.Item(entity);
    }

    export interface IItem extends IFeature, StoryScript.IItem {
        // requirement: skill-waarde - dit moet in ruleservice zitten
    }
}