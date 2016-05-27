module StoryScript.Interfaces {
    export interface ILocation {
        id?: string;
        name: string;
        enemies?: [() => IEnemy];
        items?: [() => IItem];
        destinations?: ICollection<IDestination>;
        events?: [(game: Game) => void];
        actions?: ICollection<IAction>;
        combatActions?: ICollection<IAction>;
        descriptionSelector?: () => string;
    }
}