namespace StoryScript {
    /**
     * An extension of the array class to more easily work with arrays of compiled items in StoryScript.
     */
    export interface ICompiledCollection<T, U> extends Array<U> {
        /**
         * Gets an item from the collection using its id or function name.
         * @param id 
         */
        get?(id?: string | (() => T)): U;

        /**
         * Add an item to the collection using its id or function name.
         * @param id 
         */
        push(id?: string | (() => T) | U): number;

        /**
         * Remove an item from the collection using its id or function name.
         * @param id 
         */
        // Todo: the ...params seems to be not used. Keep it in, or use only a parameterless function (that IS needed)?
        remove?(id: string | ((...params) => U) | U): void;
    }
}