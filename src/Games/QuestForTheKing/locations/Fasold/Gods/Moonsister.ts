module QuestForTheKing.Locations {
    export function Moonsister() {
        return Location({
            name: 'The Moonsister',
            destinations: [
                {
                    name: 'Fasold the Storyteller',
                    target: Locations.Fasold1
                },
                {

                    name: 'The Skysister',
                    target: Locations.Skysister
                },
                {

                    name: 'The Seasister',
                    target: Locations.Seasister
                },
                {

                    name: 'Lesser Sisters',
                    target: Locations.Lessersisters
                }

            ]
        });
    }
}
