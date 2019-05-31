namespace StoryScript {
    /**
     * Defines an object that can participate in combinations.
     */
    export interface ICombinable {
        /**
         * The name of the object.
         */
        name: string;

        /**
         * The combinations this object type can participate in.
         */
        combinations?: ICombinations<() => ICombinable>;
    }

        /**
     * Defines an object that can participate in combinations.
     */
    export interface ICompiledCombinable extends ICombinable {
        /**
         * The id of the object.
         */
        id: string;
    }
}