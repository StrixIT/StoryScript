module QuestForTheKing.Locations {
    export function Guardians() {
        return Location({
            name: 'The Strange Trees',
            destinations: [
                {
                    name: 'Back to the Map',
                    target: Locations.Quest1map4
                },    
                {
                    name: 'To the Cliffwall',
                    target: Locations.Cliffwall,
                    barrier: {
                        name: 'Wall of branches',
                        key: Items.Parchment
                    }
                }                                     
            ]
        });
    }
}    
