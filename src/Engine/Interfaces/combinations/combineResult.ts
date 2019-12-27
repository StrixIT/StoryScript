export interface ICombineResult {
    /**
     * The result text of the combination attempt.
     */
    text: string;

    /**
     * True if a successful match was made, false otherwise.
     */
    success: boolean;

    /**
     * If true, remove the tool feature after the match is made.
     */
    removeTool?: boolean
    
    /**
     * If true, remove the target feature after the match is made.
     */
    removeTarget?: boolean
}