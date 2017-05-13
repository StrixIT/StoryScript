module PathOfHeroes {
    export interface ICompiledLocation extends StoryScript.ICompiledLocation {
        activeEnemies?: StoryScript.ICompiledCollection<IEnemy, ICompiledEnemy>;
        enemies?: StoryScript.ICompiledCollection<IEnemy, ICompiledEnemy>;
        items?: StoryScript.ICollection<IItem>;
    }
}