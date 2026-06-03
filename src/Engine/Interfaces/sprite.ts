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
     * The height of each animation frame in pixels. When omitted, the height of the sheet will be used.
     */
    height?: number;

    /**
     * The number of frames to display. When omitted, this value will be calculated from the sheet
     * size and the dimensions specified.
     */
    steps?: number;

    /**
     * The speed at which to display one iteration through all the animation steps, in seconds. When
     * omitted, a default of 1 second is used.
     */
    speed?: number;
}