module QuestForTheKing.Locations {
    export function Start() {
        return Location({
            name: 'Start',
            destinations: [
                {
                    name: 'Day 1',
                    target: Locations.Day1
                }
            ]
        });
    }
}