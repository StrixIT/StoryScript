namespace StoryScript {
    export interface ICollection<T> extends Array<T> {
        /**
         * Get an item from the collection using the item itself, its id or its function name.
         * @param id 
         */
        // Note: the params is required to find e.g. actions that have parameters.
        get?(id?: string | ((...params: any) => T) | T): T;

        /**
         * Add an item to the collection directly or using its id.
         * @param id 
         */
        push(id?: string | ((...params: any) => T) | T): number;

        /**
         * Remove an item from the collection directly or using its id.
         * @param id 
         */
        remove?(id: string | ((...params: any) => T) | T): void;
    }

    export interface ILocationCollection extends ICollection<ICompiledLocation> {
        get?(id?: string | (() => ILocation) | ICompiledLocation): ICompiledLocation;
    }
}