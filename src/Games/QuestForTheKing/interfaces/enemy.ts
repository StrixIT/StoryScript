module QuestForTheKing {
    export interface IEnemy extends StoryScript.IEnemy {
        attack: string;
        reward: number;
        activeNight?: boolean;
        activeDay?: boolean;
    }
}