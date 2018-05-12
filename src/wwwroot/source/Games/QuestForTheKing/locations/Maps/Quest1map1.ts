module QuestForTheKing.Locations {
    export function Quest1map1(): StoryScript.ILocation {
        return {
            name: 'The Forest of Myrr',
            destinations: [
                {
                    name: 'Go to the Tent',
                    target: Locations.BrennusDay
                },
                {
                    name: 'Go to the Woodcutters Lodge',
                    target: Locations.WoodcutterDay
                },
                {
                    name: 'Go to the Forest Lake',
                    target: Locations.ForestLake
                },       
                {
                    name: 'Go to the Stone Mount',
                    target: Locations.StonemountDay
                },
                {
                    name: 'Go to the Merchant',
                    target: Locations.MerchantDay
                },
                {
                    name: 'Go to the Northern Forest',
                    target: Locations.Quest1map2,
                    style: 'location-danger'
                },               
                {
                    name: 'Go to the Southern Forest',
                    target: Locations.Quest1map4,
                    style: 'location-danger'
                }
            
            ]    
           
        }
    }
}