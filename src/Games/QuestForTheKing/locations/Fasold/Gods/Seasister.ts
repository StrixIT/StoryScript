module QuestForTheKing.Locations {
    export function Seasister() {
        return Location({
            name: 'The Seasister',
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

                    name: 'The Moonsister',
                    target: Locations.Moonsister
                },
                {

                    name: 'Lesser Sisters',
                    target: Locations.Lessersisters
                }
         
            ]
        });
    }
}
