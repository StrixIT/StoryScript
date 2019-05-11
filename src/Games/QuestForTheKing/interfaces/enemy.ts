module QuestForTheKing {
    export function Enemy<T extends IEnemy>(entity: T): T {
        return StoryScript.Enemy(entity);
    }

    export interface IEnemy extends StoryScript.IEnemy {
        attack: string;
        reward: number;
        activeNight?: boolean;
        activeDay?: boolean;
    }
}