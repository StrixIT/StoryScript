module StoryScript {
    export interface IDefinitions {
        locations: [() => ILocation];
        actions: [() => IAction];
        enemies: [() => IEnemy];
        items: [() => IItem];
    }
}