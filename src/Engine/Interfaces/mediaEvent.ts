import {Sprite} from "./sprite";

/**
 * The settings for playing media when an event occurs. Specify one or more of the properties to use. All of them will
 * be used in parallel, so when you specify both a delay and a sound the one taking longest to complete will determine
 * the duration of the event. As images don't have a duration, always specify a delay for displaying them as well.
 */
export interface IMediaEvent {
    /**
     * The amount of milliseconds to wait when the event occurs.
     */
    delay?: number;
    
    /**
     * The image to display when the event occurs. This should be a path to an image in the resources folder.
     */
    image?: string;

    /**
     * The sound file to play when the event occurs. This should be a path to an image in the resources folder.
     */
    sound?: string;

    /**
     * The animation to play when the event occurs.
     */
    animation?: Sprite;
}