namespace RidderMagnus {
    export function BuildItem<T extends IItem>(entity: T): T {
        return StoryScript.BuildItem(entity);
    }

    export interface IItem extends StoryScript.IItem {
        
        // requirement: skill-waarde - dit moet in ruleservice zitten
    }
}