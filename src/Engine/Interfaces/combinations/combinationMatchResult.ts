export interface ICombinationMatchResult {
    /**
     * The result text of the combination match.
     */
    text: string,

    /**
     * If true, remove the tool feature after the match is made.
     */
    removeTool?: boolean
    
    /**
     * If true, remove the target feature after the match is made.
     */
    removeTarget?: boolean
}