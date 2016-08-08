module RidderMagnus {
    export class TextService implements ng.IServiceProvider, StoryScript.ITextService {
        public $get(game: IGame): StoryScript.ITextService {
            var self = this;

            return {
                gameName: "Ridder Magnus",
                newGame: "Nieuw spel",
                startAdventure: "Begin",
                equipmentHeader: "Uitrusting",
                yourName: "Welkom, Ridder Magnus. Vul hier je naam in:",
                youAreHere: "Hier ben je",
                destinations: "Hier kan je heen",
                onTheGround: "Op de grond",
                messages: "Wat gebeurt er?",
                backpack: "Rugzak",
                back: "Terug: ",
                attack: "Val {0} aan!",
                startOver: "Begin overnieuw",
                resetWorld: "Reset wereld",
                actions: "Dit kan je doen",
                head: "Hoofd",
                body: "Lichaam",
                enemies: "Vijanden",
                loading: "Laden...",
                equip: "Pakken of aantrekken",
                use: "Gebruiken",
                drop: "Laten vallen",
                leftHand: "Linkerhand",
                rightHand: "Rechterhand",
                amulet: "Sieraad",
                congratulations: "Gefeliciteerd",
                feet: "Voeten",
                finalScore: "Eindscore",
                youLost: "Verloren",
                youWon: "Gewonnen",

            };
        }
    }

    var storyScriptModule = angular.module("storyscript");
    storyScriptModule.service("textService", TextService);
}