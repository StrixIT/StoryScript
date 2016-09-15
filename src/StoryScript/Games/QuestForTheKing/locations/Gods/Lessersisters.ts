module QuestForTheKing.Locations {
    export function Lessersisters(): StoryScript.ILocation {
        return {
            name: 'Lesser Sisters',
            destinations: [
                {
                    text: 'Fasold the Storyteller',
                    target: Locations.Fasold1
                },
                {

                    text: 'The Skysister',
                    target: Locations.Skysister
                },
                {

                    text: 'The Seasister',
                    target: Locations.Seasister
                },
                {

                    text: 'The Moonsister',
                    target: Locations.Moonsister
                }
         
            ]
        }
    }
}
