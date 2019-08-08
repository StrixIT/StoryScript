module QuestForTheKing.Locations {
    export function Gods() {
        return Location({
            name: 'Gods of Idunia',
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
                },
                {

                    name: 'Lesser Sisters',
                    target: Locations.Lessersisters
                }        
            ]
        });
    }
}
