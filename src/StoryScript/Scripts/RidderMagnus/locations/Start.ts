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
                if (game.character.items.get(Items.GoudenRing)) {
                    return "een";
                }

                return "nul";

                //wanneer mogelijk moet deze checken of de quest 'vind de ring' actief is.
            },
            actions: [
                {
                    text: 'Genees me',
                    execute: (game: IGame) => {
                        Actions.Heal('50d1')
                        game.logToActionLog('De koninging legt haar hand op je hoofd. Je voelt je direct beter.');
                        return true
                    }
                }

            ]
        }
    }
}