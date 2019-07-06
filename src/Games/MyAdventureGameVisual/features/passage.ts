namespace MyAdventureGameVisual.Features {
    export function Passage() {
        return Feature({
            name: 'Passage',
            map: "forest",
            coords:"492,241,464,196",
            shape:"rect",
            combinations: {
                combine: [
                    {
                        combinationType: Constants.WALK,
                        match: (game, target, tool): string => {
                            game.changeLocation(Locations.Passage);
                            return 'You crawl through the undergrowth...';
                        }
                    },
                ]
            }
        });
    }
}