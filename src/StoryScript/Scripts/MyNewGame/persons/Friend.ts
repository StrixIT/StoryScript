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
            disposition: StoryScript.Disposition.Friendly
        }
    }
}