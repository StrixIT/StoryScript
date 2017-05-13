module RidderMagnus {
    export interface ICompiledLocation extends StoryScript.ICompiledLocation {
        actions?: StoryScript.ICollection<IAction>;
        activeEnemies?: StoryScript.ICompiledCollection<IEnemy, ICompiledEnemy>;
        enemies?: StoryScript.ICompiledCollection<IEnemy, ICompiledEnemy>;
        items?: StoryScript.ICollection<IItem>;
        sluipCheck?: number;
    }
}