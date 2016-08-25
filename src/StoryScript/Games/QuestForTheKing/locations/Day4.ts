module QuestForTheKing.Locations {
    export function Day4(): StoryScript.ILocation {
        return {
            name: 'Day 4',
            //destinations: [
            //    {
            //        text: 'Victory',
            //        target: Locations.Victory
            //    }
            //],
            enemies: [
                Enemies.SirAyric
            ],
            events: [
                (game: IGame) => {
                    game.currentDay = 4;
                }
            ]
        }
    }
}