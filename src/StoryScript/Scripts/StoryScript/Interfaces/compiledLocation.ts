module StoryScript.Interfaces {
    export interface ICompiledLocation {
        id?: string;
        //log(message: string): void;
        name: string;
        fileLocation?: string;
        enemies?: ICollection<IEnemy>;
        items?: ICollection<IItem>;
        destinations?: ICollection<IDestination>;
        events?: [(game: Game) => void];
        actions?: ICollection<IAction>;
        combatActions?: ICollection<IAction>;
        descriptionSelector?: () => string;

        text: string;
        hasVisited: boolean;
        descriptions: any;
        log: string[];
    }
}