module StoryScript {
    export interface ICreateCharacterControllerScope extends ng.IScope {
        texts: IInterfaceTexts;
        sheet: ICreateCharacter;
    }

    export class CreateCharacterController {
        private $scope: ICreateCharacterControllerScope;
        private gameService: IGameService;
        private characterService: ICharacterService;
        private game: IGame;

        constructor($scope: ICreateCharacterControllerScope, gameService: IGameService, characterService: ICharacterService, game: IGame, texts: IInterfaceTexts) {
            var self = this;
            self.$scope = $scope;
            self.gameService = gameService;
            self.characterService = characterService;
            self.game = game;
            self.$scope.texts = texts;
            self.init();
        }

        private init() {
            var self = this;
            self.setupCharacter(self, self.$scope);
            self.$scope.$on('restart', function (event: ng.IAngularEvent) {
                self.setupCharacter(self, event.currentScope as ICreateCharacterControllerScope);
            });
        }

        private setupCharacter(controller: CreateCharacterController, scope: ICreateCharacterControllerScope) {
            scope.sheet = controller.characterService.getCreateCharacterSheet();
            scope.sheet.currentStep = 0;
            scope.sheet.nextStep = (data: ICreateCharacter) => {
                var selector = data.steps[data.currentStep].nextStepSelector;
                var previousStep = data.currentStep;

                if (selector) {
                    var nextStep = typeof selector === 'function' ? (<any>selector)(data, data.steps[data.currentStep]) : selector;
                    data.currentStep = nextStep;
                }
                else {
                    data.currentStep++;
                }

                if (data.steps[data.currentStep].initStep) {
                    data.steps[data.currentStep].initStep(data, previousStep, data.steps[data.currentStep]);
                }
            };

            controller.game.createCharacterSheet = scope.sheet;
        }

        startNewGame = () => {
            var self = this;
            self.gameService.startNewGame(self.game.createCharacterSheet);
            self.game.state = StoryScript.GameState.Play;
        }
    }

    CreateCharacterController.$inject = ['$scope', 'gameService', 'characterService', 'game', 'customTexts'];
}