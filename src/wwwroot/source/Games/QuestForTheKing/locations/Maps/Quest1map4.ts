module QuestForTheKing.Locations {
    export function Quest1map4(): StoryScript.ILocation {
        return {
            name: 'The Eastern Forest',
            destinations: [
                
                 {                          
                    name: 'The Necromancer',
                    target: Locations.NecromancerDay                
                },
                  {                          
                     name: 'Dark Magic',
                     target: Locations.Darkmagic
                 },
                   {                          
                      name: 'The Strange Trees',
                      target: Locations.Guardians
                  },
                   {                          
                       name: 'Go to the Eastern Forest',
                       target: Locations.Quest1map3,
                       style: 'location-danger'
                   },     
                   {                          
                       name: 'Go to the Western Forest',
                       target: Locations.Quest1map1,
                       style: 'location-danger'
                   }    
            ]    
           
        }
    }
}