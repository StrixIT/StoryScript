namespace StoryScript {
    export interface IDynamicStyle {
        /**
         * The selector for the element to style dynamically.
         */
        elementSelector: string;

        /**
         * The styles to apply as name/value pairs. E.g. ['margin-top', '50px'];
         */
        styles: string[][];
    }
}