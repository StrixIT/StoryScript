module QuestForTheKing.Locations {
    export function Start() {
        return BuildLocation({
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