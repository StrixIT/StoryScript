import {IItem} from './item';

/**
 * An interface for items that can be combined with others of the same type to create an item group. This is
 * useful if you want to prevent cluttering the player inventory with many items of the same type. A GroupableItem is
 * itself an item, so the first item in the group is used as the parent and additional items are added to the members
 * array.
 */
export interface IGroupableItem<T extends IItem> extends IItem {
    /**
     * This flag is always set to true for groupable items. It is used to separate groupable items from regular items.
     */
    isGroupable: boolean;

    /**
     * The name to show for the group of items. Use a placeholder to specify where the number of items in the group
     * should be shown. E.g. '{0} rocks'.
     */
    groupName: string;

    /**
     * If this number is set, a group of these items can contain no more than this number of items. This is counting
     * the parent and the members.
     */
    maxSize?: number;

    /**
     * Specify the items that can be grouped together with this one. If omitted, only items of the same type can be
     * grouped.
     */
    groupTypes?: ((() => IGroupableItem<T>) | string)[];

    /**
     * The items that belong to this group.
     */
    members?: IGroupableItem<T>[];
}