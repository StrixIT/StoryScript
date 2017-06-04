module DangerousCave.Locations {
    export function Temp(): StoryScript.ILocation {
        return {
            name: 'Deze locatie bestaat nog niet',
            destinations: [
                {
                    name: 'Ga terug naar de ingang',
                    target: Locations.Entry,
                }
            ]
        }
    }
}