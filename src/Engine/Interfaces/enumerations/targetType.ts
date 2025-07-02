/**
 * Used to determine whether an item usable in combat can be used on enemies or party characters.
 */
export enum TargetType {
    Ally = 'Ally',
    AllyOrSelf = 'AllyOrSelf',
    Enemy = 'Enemy',
    Self = 'Self'
}