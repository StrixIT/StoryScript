namespace RidderMagnus {
    export function Item<T extends IItem>(entity: T): T {
        return StoryScript.Item(entity);
    }

    export interface IItem extends StoryScript.IItem {
        
        // requirement: skill-waarde - dit moet in ruleservice zitten
    }
}