module QuestForTheKing.Locations {
    export function Castlequestdone() {
        return Location({
            name: 'Returned with the Flower',
            destinations: [
                {
                    name: 'Back to the Map',
                    target: Locations.Quest1map2
                }
            ],
            items: [
                Items.Beesting(),
            ]
        });
    }
}
