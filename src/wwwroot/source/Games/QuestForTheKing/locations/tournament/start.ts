module QuestForTheKing.Locations {
    export function Start(): StoryScript.ILocation {
        return {
            name: 'Start',
            destinations: [
                {
                    name: 'Day 1',
                    target: Locations.Day1
                }
            ]
        }
    }
}