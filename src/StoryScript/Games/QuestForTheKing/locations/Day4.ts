module QuestForTheKing.Locations {
    export function Day4(): StoryScript.ILocation {
        return {
            name: 'Day 4',
            enemies: [
                Enemies.SirAyric
            ],
            events: [
                changeDay
            ]
        }
    }
}