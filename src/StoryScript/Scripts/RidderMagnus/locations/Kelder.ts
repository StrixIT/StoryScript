module RidderMagnus.Locations {
    export function Kelder(): StoryScript.ILocation {
        return {
            name: 'De Kelder',
            //Bij eerste bezoek: er komt hier als event eenmalig een dire rat, tenzij je succesvol sluipt. 
            //Met zoeken is er een ring te vinden. 
            //Als de ring al gevonden is, levert zoeken vooral ratten op.
            enemies: [
                Enemies.DireRat
            ],
            destinations: [
                {
                    text: 'Naar boven',
                    target: Locations.Start
                }
            ],
        }
    }
}