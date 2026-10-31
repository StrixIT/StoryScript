import {Sprite} from "./sprite";

export interface IActor {
    /**
     * The total health of the actor when in top condition.
     */
    hitpoints: number;

    /**
     * The current health of the actor.
     */
    currentHitpoints?: number;
    
    /**
     * The sound files that are used for the actor, if any.
     */
    sounds?: {
        /**
         * The sound file to play when the actor attacks in combat, if any.
         */
        attack?: string;

        /**
         * The sound file to play when the actor is defeated in combat, if any.
         */
        defeated?: string;
    },
    
    /**
     * The animations that are used for the actor, if any.
     */
    animations?: {
        /**
         * The animation to play when the actor attacks in combat, if any.
         */
        attack?: Sprite;

        /**
         * The animation to play when the actor is defeated in combat, if any.
         */
        defeated?: Sprite;
    }
} 