module QuestForTheKing.Locations {
    export function Start(): StoryScript.ILocation {
        return {
            name: 'Start',
            destinations: [
                {
                    text: 'Day 1',
                    target: Locations.Day1
                }
            ]
        }
    }
}