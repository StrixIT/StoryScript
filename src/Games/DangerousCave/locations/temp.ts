namespace DangerousCave.Locations {
    export function Temp() {
        return Location({
            name: 'Deze locatie bestaat nog niet',
            destinations: [
                {
                    name: 'Ga terug naar de ingang',
                    target: Locations.Entry,
                }
            ]
        });
    }
}