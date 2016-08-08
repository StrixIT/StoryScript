module RidderMagnus.Enemies {
    export function DireRat(): StoryScript.IEnemy {
        return {
            name: 'Reusachtige rat',
            hitpoints: 13,
            attack: '1d6+2',
            reward: 2
            // reward should be: 1 rattenstaart (quest item), 2 punten (score)
        }
    }
}