module QuestForTheKing.Locations {
    export function Quest1map3(): StoryScript.ILocation {
        return {
            name: 'The Eastern Forest',
            destinations: [
                {                          
                    text: 'Go to the Northern Forest',
                    target: Locations.Quest1map2,
                    style: 'location-danger'
                },
                {
                    text: 'Go to the Southern Forest',
                    target: Locations.Quest1map4,
                    style: 'location-danger'
                },
                 {                          
                    text: 'The Ocean Shrine',
                    target: Locations.OceanshrineDay                  
                },
                  {                          
                     text: 'The Dryad Tree',
                     target: Locations.DryadDay
                 },
                   {                          
                      text: 'The Tree Stump',
                      target: Locations.Treestump
                   {                          
                       text: 'The Troll',
                       target: Locations.TrollDay
                   }           
            ]    
           
        }
    }
}