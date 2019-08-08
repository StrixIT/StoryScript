namespace RidderMagnus.Persons {
    export function KoninginDagmar() {
        return Person({
            name: 'Koningin Dagmar',
            //picture:
            hitpoints: 1000,
            attack: '10d6',
            reward: 100,
            currency: 1000,
            conversation: {
                actions: {
                    'test': (game, person) => {
                        var test = 0;
                    }
                }
            },
            quests: [
                Quests.GoudenRing(),
                Quests.RattenStaarten()
            ]
        });
    }
}