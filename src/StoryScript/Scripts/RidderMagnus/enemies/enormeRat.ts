module RidderMagnus.Enemies {
    export function EnormeRat(): StoryScript.IEnemy {
        return {
            name: 'Enorme rat',
            pictureFileName: 'enemies/EnormeRat.jpg' ,
            hitpoints: 7 ,
            attack: '1d6',
            reward: 1
            // reward should be: 1 rattenstaart (quest item), 1 punt (score)
        }
    }
}