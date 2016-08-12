module MyNewGame.Persons {
    export function Friend(): IPerson {
        return {
            name: 'Joe',
            pictureFileName: 'bandit.jpg',
            hitpoints: 10,
            attack: '1d6',
            items: [
                Items.Sword
            ],
            trade: {
                buy: {
                    description: 'These items look good, I\'d like to buy them from you',
                    emptyText: 'You have nothing left that I\'m interested in',
                    itemSelector: (item: IItem) => {
                        return true;
                    },
                    maxItems: 5
                },
                sell: {
                    description: 'I\'m willing to part with these items...',
                    emptyText: 'I have nothing left to sell to you...',
                    itemSelector: (item: IItem) => {
                        return true;
                    },
                    maxItems: 5
                }
            },
            disposition: StoryScript.Disposition.Friendly
        }
    }
}