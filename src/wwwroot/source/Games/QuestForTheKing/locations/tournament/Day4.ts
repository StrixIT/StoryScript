module QuestForTheKing.Locations {
    export function Day4(): StoryScript.ILocation {
        return {
            name: 'Day 4',
            destinations: [
                {
                    name: 'To the feast',
                    target: Locations.Victory
                }
            ],
            enemies: [
                Enemies.SirAyric
            ],
            enterEvents: [
                changeDay
            ]
        }
    }
}