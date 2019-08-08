module QuestForTheKing.Locations {
    export function Victory() {
        return Location({
            name: 'Victory',
            destinations: [
                {
                    name: 'Start again',
                    target: Locations.Start
                },
                {
                    name: 'Start your first Quest',
                    target: Locations.Quest1,
                    style: 'location-danger'
                }
            ]           
        });
    }
}
