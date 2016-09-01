module QuestForTheKing.Locations {
    export function Skysister(): StoryScript.ILocation {
        return {
            name: 'The Sister of the Sky',
            destinations: [
                {
                    text: 'Fasold the Storyteller',
                    target: Locations.Fasold1
                },
                {

                    text: 'The Seasister',
                    target: Locations.Seasister
                },
                {

                    text: 'The Moonsister',
                    target: Locations.Moonsister
                },
                {

                    text: 'Lesser Sisters',
                    target: Locations.Lessersisters
                }
            
            ]
        }
    }
}
