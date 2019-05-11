namespace RidderMagnus.Locations {
    export function Tunnel() {
        return Location({
            name: 'Een tunnel onder het paleis',

            destinations: [
                {
                    name: 'Naar beneden',
                    target: Locations.EersteGang
                },
                {
                    name: 'Naar boven',
                    target: Locations.Kelder
                }
            ],
           //event: hier zit een val. Licht en Zoeken kan het voorkomen, anders gaat hij af.
           //Een lading stenen valt van boven op de held. Een helm helpt.
        });
    }
}