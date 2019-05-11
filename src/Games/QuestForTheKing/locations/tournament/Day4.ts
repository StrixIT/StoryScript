module QuestForTheKing.Locations {
    export function Day4() {
        return BuildLocation({
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
        });
    }
}