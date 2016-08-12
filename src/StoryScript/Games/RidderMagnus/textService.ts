module RidderMagnus {
    export class TextService implements ng.IServiceProvider, StoryScript.ITextService {
        public $get(game: IGame): StoryScript.ITextService {
            var self = this;

            return {
                actions: "Dit kan je doen",
                amulet: "Sieraad",
                attack: "Val {0} aan!",
                back: "Terug: ",
                backpack: "Rugzak",
                body: "Lichaam",
                congratulations: "Gefeliciteerd",
                currency: "Goudstukken",
                hitpoints: "Gezondheid",
                destinations: "Hier kan je heen",
                drop: "Laten vallen",
                enemies: "Vijanden",
                equip: "Pakken of aantrekken",
                equipmentHeader: "Uitrusting",
                feet: "Voeten",
                finalScore: "Eindscore",
                gameName: 'Ridder Magnus',
                head: "Hoofd",
                leftHand: "Linkerhand",
                loading: "Laden...",
                messages: "Wat gebeurt er?",
                newGame: "Nieuw spel",
                onTheGround: "Op de grond",
                resetWorld: "Reset wereld",
                rightHand: "Rechterhand",
                startAdventure: "Begin",
                startOver: "Begin overnieuw",
                use: "Gebruiken",
                //value: "Waarde",
                youAreHere: "Hier ben je",
                youLost: "Verloren",
                youWon: "Gewonnen",
                yourName: "Welkom, Ridder Magnus. Vul hier je naam in:",
               
            };
        }
    }

    var storyScriptModule = angular.module("storyscript");
    storyScriptModule.service("textService", TextService);
}