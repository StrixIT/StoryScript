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

                var currentStep = data.steps[data.currentStep];

                if (currentStep.initStep) {
                    currentStep.initStep(data, previousStep, currentStep);
                }

                if (currentStep.attributes) {
                    currentStep.attributes.forEach(attr => {
                        attr.entries.forEach(entry => {
                            if (entry.min) {
                                entry.value = entry.min;
                            }
                        });
                    });
                }
            };

            controller.game.createCharacterSheet = scope.sheet;
        }

        startNewGame = () => {
            var self = this;
            self.gameService.startNewGame(self.game.createCharacterSheet);
            self.game.state = StoryScript.GameState.Play;
        }

        limitInput = (event: ng.IAngularEvent, attribute: ICreateCharacterAttribute, entry: ICreateCharacterAttributeEntry) => {
            var self = this;
            var value = parseInt((<any>event).target.value);

            if (!isNaN(value)) {
                var totalAssigned = 0;

                attribute.entries.forEach((innerEntry, index) => {
                    if (index !== attribute.entries.indexOf(entry)) {
                        totalAssigned += <number>innerEntry.value || 1;
                    }
                });

                if (totalAssigned + value > attribute.numberOfPointsToDistribute) {
                    value = attribute.numberOfPointsToDistribute - totalAssigned;
                }

                entry.value = value;

                if (entry.value > entry.max) {
                    entry.value = entry.max;
                }
                else if (entry.value < entry.min) {
                    entry.value = entry.min;
                }
            }
            else {
                entry.value = entry.min;
            }
        }

        distributionDone = (step: ICreateCharacterStep) => {
            var self = this;
            var done = true;

            if (step) {
                done = self.checkStep(step);
            }
            else {
                if (self.$scope.sheet && self.$scope.sheet.steps) {
                    self.$scope.sheet.steps.forEach(step => {
                        done = self.checkStep(step);
                    });
                }
            }

            return done;
        }

        private checkStep(step: ICreateCharacterStep) {
            var done = true;

            if (step.attributes) {
                step.attributes.forEach(attr => {
                    var totalAssigned = 0;
                    var textChoicesFilled = 0;

                    attr.entries.forEach((entry) => {
                        if (!entry.max) {
                            if (entry.value) {
                                textChoicesFilled += 1;
                            }
                        }
                        else {
                            totalAssigned += <number>entry.value || 1;
                        }
                    });

                    done = totalAssigned === attr.numberOfPointsToDistribute || textChoicesFilled === attr.entries.length;
                });
            }

            return done;
        }
    }

    CreateCharacterController.$inject = ['$scope', 'gameService', 'characterService', 'game', 'customTexts'];
}