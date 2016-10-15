module RidderMagnus {
    export interface ICompiledLocation extends StoryScript.ICompiledLocation {
        actions?: StoryScript.ICollection<IAction>;
        activeEnemies?: StoryScript.ICollection<IEnemy>;
        enemies?: StoryScript.ICollection<IEnemy>;
        items?: StoryScript.ICollection<IItem>;
        sluipCheck?: number;
    }
}