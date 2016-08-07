module DangerousCave {
    export class TextService implements ng.IServiceProvider, StoryScript.ITextService {
        public $get(): StoryScript.ITextService {
            var self = this;

            return {
                newGame: "Nieuw spel",
                startAdventure: "Start avontuur",
                equipmentHeader: "Uitrusting",
                gameName: "Gevaarlijke grot",
                yourName: "Hoe heet je?",
                youAreHere: "Je bent hier",
                destinations: "Uitgangen",
                onTheGround: "Op de grond",
                messages: "Gebeurtenissen",
                backpack: "Rugzak",
                back: "Terug: ",
                attack: "Val {0} aan!",
                startOver: "Begin overnieuw",
                resetWorld: "Reset wereld",
                actions: "Acties",
                head: "Hoofd",
                body: "Lichaam",
                enemies: "Vijanden",
                loading: "Laden...",
                equip: "Ter hand nemen",
                use: "Gebruiken",
                drop: "Laten vallen"
            };
        }
    }

    var storyScriptModule = angular.module("storyscript");
    storyScriptModule.service("textService", TextService);
}