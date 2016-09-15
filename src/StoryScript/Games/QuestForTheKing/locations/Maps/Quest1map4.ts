module QuestForTheKing.Locations {
    export function Quest1map4(): StoryScript.ILocation {
        return {
            name: 'The Eastern Forest',
            destinations: [
                
                 {                          
                    text: 'The Necromancer',
                    target: Locations.NecromancerDay                
                },
                  {                          
                     text: 'Dark Magic',
                     target: Locations.DarkmagicDay
                 },
                   {                          
                      text: 'The Strange Trees',
                      target: Locations.GuardiansDay
                  },
                   {                          
                       text: 'Go to the Eastern Forest',
                       target: Locations.Quest1map3,
                       style: 'location-danger'
                   },     
                   {                          
                       text: 'Go to the Western Forest',
                       target: Locations.Quest1map1,
                       style: 'location-danger'                  }    
            ]    
           
        }
    }
}