module QuestForTheKing.Locations {
    export function Magicflowers() {
        return BuildLocation({
            name: 'The Magic Flowers',
            destinations: [
                {
                    name: 'Back to the Map',
                    target: Locations.Quest1map2
                }              
            ],            
            enemies: [
                Enemies.Brownbear

            ],
            items: [
                Items.Magicflower,                
            ]
        });
    }
}
   
