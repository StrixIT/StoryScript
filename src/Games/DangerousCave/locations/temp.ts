namespace DangerousCave.Locations {
    export function Temp() {
        return BuildLocation({
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