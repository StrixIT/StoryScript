module QuestForTheKing {
    export interface IEnemy extends StoryScript.IEnemy {
        attack: string;
        reward: number;
        nightEncounter?: boolean;
    }
}