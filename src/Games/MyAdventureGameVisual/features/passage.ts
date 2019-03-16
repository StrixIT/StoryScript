namespace MyAdventureGameVisual.Features {
    export function Passage(): StoryScript.IFeature {
        return {
            name: 'Passage',
            map: "forest",
            coords:"492,241,464,196",
            shape:"rect",
            combinations: {
                combine: [
                    {
                        type: Constants.WALK,
                        match: (game, tool, target): string => {
                            game.changeLocation(Locations.Passage);
                            return 'You crawl through the undergrowth...';
                        }
                    },
                ]
            }
        }
    }
}