module QuestForTheKing.Locations {
    export function Lessersisters() {
        return Location({
            name: 'Lesser Sisters',
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

                    name: 'The Moonsister',
                    target: Locations.Moonsister
                }
         
            ]
        });
    }
}
