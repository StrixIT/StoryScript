module QuestForTheKing.Locations {
    export function Moonsister(): StoryScript.ILocation {
        return {
            name: 'The Moonsister',
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

                    text: 'Lesser Sisters',
                    target: Locations.Lessersisters
                }

            ]
        }
    }
}
