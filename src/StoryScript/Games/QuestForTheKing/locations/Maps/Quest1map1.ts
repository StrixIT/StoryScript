module QuestForTheKing.Locations {
    export function Quest1map1(): StoryScript.ILocation {
        return {
            name: 'The Forest of Myrr',
            destinations: [
                {
                    text: 'Go to the Tent',
                    target: Locations.BrennusDay
                },
                {
                    text: 'Go to the Woodcutters Lodge',
                    target: Locations.WoodcutterDay
                },
                {
                    text: 'Go to the Forest Lake',
                    target: Locations.ForestLakeDay
                },       
                {
                    text: 'Go to the Stone Mount',
                    target: Locations.StonemountDay
                },
                {
                    text: 'Go to the Merchant',
                    target: Locations.MerchantDay
                },
                {
                    text: 'Go to the Northern Forest',
                    target: Locations.Quest1map2,
                    style: 'location-danger'
                },               
                {
                    text: 'Go to the Southern Forest',
                    target: Locations.Quest1map4,
                    style: 'location-danger'
                }
            
            ]    
           
        }
    }
}