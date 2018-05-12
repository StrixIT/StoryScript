﻿module QuestForTheKing.Locations {
    export function Interception(): StoryScript.ILocation {
        return {
            name: 'You intercept the strange man',
            destinations: [
                {
                    name: 'Back to the Map',
                    target: Locations.Quest1map3
                },     
            ],
            enemies: [
                Enemies.Satyr,
              
            ]
        }
    }
}    
                                      
   