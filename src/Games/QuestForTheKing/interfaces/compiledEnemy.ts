module QuestForTheKing {
    export interface ICompiledEnemy extends StoryScript.ICompiledEnemy {
        attack: string;
        reward: number;
        activeNight?: boolean;
        activeDay?: boolean;
    }
}