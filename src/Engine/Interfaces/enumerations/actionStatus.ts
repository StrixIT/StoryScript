/**
 * Used to set the availability of actions to the player.
 */
export enum ActionStatus {
    /**
     * The action shows up for the player and is selectable.
     */
    Available,

        /**
     * The action shows up for the player but is not selectable. Useful to show actions that could be performed if additional criteria
     * would have been met (e.g. the character needs to be stronger to break down a door).
     */
    Disabled,

        /**
     * The action is not shown to the player. Useful for actions that are only conditionally available.
     */
    Unavailable
}