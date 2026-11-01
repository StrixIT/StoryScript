import {IMediaEvent} from "./mediaEvent";

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
     * The media events for the actor.
     */
    mediaEvents?: Record<string, IMediaEvent>
} 