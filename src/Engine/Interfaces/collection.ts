namespace StoryScript {
    /**
     * An extension of the array class to more easily work with them in StoryScript.
     */
    export interface ICollection<T> extends Array<T> {
        /**
         * Get an item from the collection using its id or function name.
         * @param id 
         */
        get?(id?: string | ((...params) => T)): T;

        /**
         * Add an item to the collection using its id or function name.
         * @param id 
         */
        push(id?: string | (() => T) | T): number;

        /**
         * Remove an item from the collection using its id or function name.
         * @param id 
         */
        remove?(id: string | (() => T) | T): void;
    }
}