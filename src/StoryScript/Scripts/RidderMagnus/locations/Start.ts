module RidderMagnus.Locations {
    export function Start(): StoryScript.ILocation {
        return {
            name: 'De Troonzaal',
            destinations: [
                {
                    text: 'Naar de kelder!',
                    target: Locations.Kelder
                }
            ],
            descriptionSelector: (game: IGame) => {
                if (game.character.items.get('GoudenRing'))
                {
                    return "een";
                }

                return "nul";

                //wanneer mogelijk moet deze checken of de quest 'vind de ring' actief is.
            }
        }
    }
}