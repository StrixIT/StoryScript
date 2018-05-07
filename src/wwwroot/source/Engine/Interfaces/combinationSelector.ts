namespace StoryScript {
    export interface ICombinationSelector {
        combination: ICombination;
        combineSources: any[];
        combineTargets: any[];
        combineActions: ICombinationAction[];
    }

    export interface ICombination {
        source: { name };
        target: { name };
        type: ICombinationAction;
    }
}