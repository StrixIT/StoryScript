export interface Sprite {
    /**
     * The path to the animation's sprite sheet. It should be relative to the resources folder.
     */
    sheet: string;

    /**
     * The width of each animation frame in pixels.
     */
    width: number;

    /**
     * The height of each animation frame in pixels.
     */
    height: number;

    /**
     * The number of frames to display.
     */
    steps: number;

    /**
     * The speed at which to display one iteration through all the animation steps, in seconds. When
     * omitted, a default of 1 second is used.
     */
    speed?: number;

    /**
     * The number of times the animation should be played. When omitted, the animation will continue playing until
     * stopped via code.
     */
    iterations?: number;

    /**
     * When specified, this function will be called when the animation has finished playing the number of specified
     * iterations or is stopped via code.
     */
    finishedCallBack?: () => void;
}