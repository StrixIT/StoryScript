module RidderMagnus.Persons {
    export function KoninginDagmar(): IPerson {
        return {
            name: 'Koningin Dagmar',
            //pictureFileName:
            hitpoints: 1000,
            attack: '10d6',
            reward: 100 ,
            disposition: StoryScript.Disposition.Friendly
        }
    }
}