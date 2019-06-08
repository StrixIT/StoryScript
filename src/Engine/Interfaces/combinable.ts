namespace StoryScript {
    /**
     * Defines an object that can participate in combinations.
     */
    export interface ICombinable {
        /**
         * The id of the object, set at runtime.
         */
        id?: string;

        /**
         * The name of the object.
         */
        name: string;

        /**
         * The combinations this object type can participate in.
         */
        combinations?: ICombinations<ICombinable>;
    }
}