﻿module QuestForTheKing.Locations {
    export function HoneycastleDay(): StoryScript.ILocation {
        return {
            name: 'The Honeycomb Castle',
            destinations: [
                {
                    name: 'Back to the Map',
                    target: Locations.Quest1map2
                },   
                {
                    name: 'Approach the Castle',
                    target: Locations.Castleapproach
                }            
            ],             
        }
    }
}    