namespace RidderMagnus.Enemies {
    export function EnormeRat() {
        return Enemy({
            name: 'Enorme rat',
            picture: 'enemies/EnormeRat.jpg' ,
            hitpoints: 7 ,
            attack: '1d6',
            reward: 1,
            onDefeat: defeatRat
            // reward should be: 1 rattenstaart (quest item), 1 punt (score)
        });
    }
}