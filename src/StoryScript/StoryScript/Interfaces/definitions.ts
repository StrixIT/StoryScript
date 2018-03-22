namespace StoryScript {
    export interface IDefinitions {
        locations: [() => ILocation];
        actions: [() => IAction];
        enemies: [() => IEnemy];
        persons: [() => IPerson];
        items: [() => IItem];
        quests: [() => IQuest];
        features: [() => IFeature];
    }
}