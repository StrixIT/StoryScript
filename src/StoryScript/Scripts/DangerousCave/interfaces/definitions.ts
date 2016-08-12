module DangerousCave {
    export interface IDefinitions extends StoryScript.IDefinitions {
        locations: [() => ILocation];
        actions: [() => IAction];
        enemies: [() => IEnemy];
        items: [() => IItem];
    }
}