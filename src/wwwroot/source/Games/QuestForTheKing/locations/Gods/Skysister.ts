module QuestForTheKing.Locations {
    export function Skysister(): StoryScript.ILocation {
        return {
            name: 'The Sister of the Sky',
            destinations: [
                {
                    name: 'Fasold the Storyteller',
                    target: Locations.Fasold1
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
        }
    }
}
