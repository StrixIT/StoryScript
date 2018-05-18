module QuestForTheKing.Enemies {
    export function SirAyric(): IEnemy {
        return {
            name: 'Sir Ayric',
            description: StoryScript.Constants.HTML,
            hitpoints: 20,
            attack: '1d8',
            reward: 1
        }
    }
}