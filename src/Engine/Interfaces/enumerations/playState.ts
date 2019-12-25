/**
 * Used to determine the situational UI to show to the player, e.g. the menu or trade screen.
 */
export enum PlayState {
    Menu = 'Menu',
    Combat = 'Combat',
    Trade = 'Trade',
    Conversation = 'Conversation',
    Description = 'Description'
}