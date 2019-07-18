namespace RidderMagnus {
    export function Action(action: IAction): IAction {
        return StoryScript.Action(action);
    }

    export interface IAction extends StoryScript.IAction {
        isSneakAction?: boolean;
    }
}