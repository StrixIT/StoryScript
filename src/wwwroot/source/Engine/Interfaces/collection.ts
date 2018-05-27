namespace StoryScript {
    /**
     * An extension of the array class to more easily work with them in StoryScript.
     */
    export interface ICollection<T> extends Array<T> {
        /**
         * Get an item from the collection using its id or function name.
         * @param id 
         */
        // Todo: the ...params seems to be not used. Keep it in, or use only a parameterless function (that IS needed)?
        get?(id?: string | ((...params) => T) | T): T;

        /**
         * Add an item to the collection using its id or function name.
         * @param id 
         */
        push(id?: string | (() => T) | T): number;

        /**
         * Remove an item from the collection using its id or function name.
         * @param id 
         */
        // Todo: the ...params seems to be not used. Keep it in, or use only a parameterless function (that IS needed)?
        remove?(id: string | ((...params) => T) | T): void;
    }
}