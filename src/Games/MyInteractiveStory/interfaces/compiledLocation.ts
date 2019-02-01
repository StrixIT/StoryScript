namespace MyInteractiveStory {
    export interface ICompiledLocation extends StoryScript.ICompiledLocation {
        activeEnemies?: StoryScript.ICompiledCollection<IEnemy, ICompiledEnemy>;
        enemies?: StoryScript.ICompiledCollection<IEnemy, ICompiledEnemy>;
        activeItems?: StoryScript.ICollection<IItem>;
        items?: StoryScript.ICollection<IItem>;

        // Add additional game-specific location properties here
    }
}