module GameTemplate {
    export interface ICompiledLocation extends StoryScript.ICompiledLocation {
        enemies?: StoryScript.ICollection<IEnemy>;
        items?: StoryScript.ICollection<IItem>;
    }
}