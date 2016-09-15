module StoryScript {
    export interface ICreateCharacterControllerScope extends ng.IScope {
        game: IGame;
        texts: IInterfaceTexts;
        sheet: ICreateCharacter;
    }

    export class CreateCharacterController {
        private $scope: ICreateCharacterControllerScope;
        private gameService: IGameService;
        private ruleService: IRuleService;
        private game: IGame;
        private texts: IInterfaceTexts;

        constructor($scope: ICreateCharacterControllerScope, gameService: IGameService, ruleService: IRuleService, game: IGame, texts: IInterfaceTexts) {
            var self = this;
            self.$scope = $scope;
            self.gameService = gameService;
            self.ruleService = ruleService;
            self.game = game;
            self.texts = texts;
            self.init();
        }

        private init() {
            var self = this;
            self.$scope.game = self.game;
            self.$scope.texts = self.texts;
            self.setupCharacter(self, self.$scope);
            self.$scope.$on('restart', function (event: ng.IAngularEvent) {
                self.setupCharacter(self, event.currentScope as ICreateCharacterControllerScope);
            });
        }

        private setupCharacter(controller: CreateCharacterController, scope: ICreateCharacterControllerScope) {
            controller.game.createCharacterSheet = controller.ruleService.getCreateCharacterSheet();
            controller.game.createCharacterSheet.currentStep = 0;
            scope.sheet = controller.game.createCharacterSheet;
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
        }

        startNewGame = () => {
            var self = this;
            self.gameService.startNewGame(self.game.createCharacterSheet);
            self.game.state = StoryScript.GameState.Play;
        }
    }

    CreateCharacterController.$inject = ['$scope', 'gameService', 'ruleService', 'game', 'customTexts'];
}