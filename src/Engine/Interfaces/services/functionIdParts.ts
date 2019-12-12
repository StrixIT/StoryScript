export interface IFunctionIdParts {
    /**
     * The type of the object the function returns, e.g. Location or Enemy.
     */
    type: string;

    /**
     * The id generated for the function.
     */
    functionId: string;

    /**
     * The function string hash.
     */
    hash: number;
}