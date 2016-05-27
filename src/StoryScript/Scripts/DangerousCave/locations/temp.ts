module StoryScript.Locations {
    export function Temp(): Interfaces.ILocation {
        return {
            name: 'Deze locatie bestaat nog niet',
            destinations: [
                {
                    text: 'Ga terug naar de ingang',
                    target: Locations.Entry,
                }
            ]
        }
    }
}