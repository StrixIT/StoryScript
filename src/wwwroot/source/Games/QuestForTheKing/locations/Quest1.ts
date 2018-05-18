module QuestForTheKing.Locations {
    export function Quest1(): StoryScript.ILocation {
        return {
            name: 'Your First Quest',
            destinations: [
                {
                    name: 'Begin your Quest',
                    target: Locations.Quest1map1
                }
            ],
            enterEvents: [
                (game: IGame) => {
                    game.worldProperties.travelCounter = 0;
                }
            ]
        }
    }
}