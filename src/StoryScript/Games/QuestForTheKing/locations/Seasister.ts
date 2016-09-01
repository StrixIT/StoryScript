module QuestForTheKing.Locations {
    export function Seasister(): StoryScript.ILocation {
        return {
            name: 'The Seasister',
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
