module RidderMagnus.Enemies {
    export function RatMan(): IEnemy {
        return {
            name: 'Ratman',
            pictureFileName: 'enemies/RatMan.jpg',
            hitpoints: 15 ,
            attack: '2d4+1',
            defense: 1 ,
            reward: 1 ,
            goudstukken: 2
            // reward should be: 1 rattenstaart (quest item), 1 punt (score)
        }
    }
}