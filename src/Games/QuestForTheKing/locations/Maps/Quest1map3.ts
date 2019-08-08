module QuestForTheKing.Locations {
    export function Quest1map3() {
        return Location({
            name: 'The Eastern Forest',
            destinations: [
                {                          
                    name: 'Go to the Northern Forest',
                    target: Locations.Quest1map2,
                    style: 'location-danger'
                },
                {
                    name: 'Go to the Southern Forest',
                    target: Locations.Quest1map4,
                    style: 'location-danger'
                },
                 {                          
                    name: 'The Ocean Shrine',
                    target: Locations.Oceanshrine
                },
                  {                          
                     name: 'The Dryad Tree',
                     target: Locations.Dryad
                 },
                   {                          
                      name: 'The Tree Stump',
                      target: Locations.Treestump
                  },   
                   {                       
                       name: 'The Troll',
                       target: Locations.Troll
                   },           
            ]
        });
    }
}