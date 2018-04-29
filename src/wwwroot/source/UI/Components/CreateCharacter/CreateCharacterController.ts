namespace StoryScript {
    export class CreateCharacterController implements ng.IComponentController {
        constructor(private _scope: ng.IScope, private _characterService: ICharacterService, private _gameService: IGameService, private _game: IGame, private _texts: IInterfaceTexts) {
            var self = this;
            self.game = _game;
            self.texts = _texts;

            self._scope.$on('createCharacter', function (event: ng.IAngularEvent) {
                self.setupCharacter();
            });
        }

        sheet: ICreateCharacter;
        game: IGame;
        texts: IInterfaceTexts;

        startNewGame = () => {
            var self = this;
            self._gameService.startNewGame(self._game.createCharacterSheet);
            self._game.state = StoryScript.GameState.Play;
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
                if (self.sheet && self.sheet.steps) {
                    self.sheet.steps.forEach(step => {
                        done = self.checkStep(step);
                    });
                }
            }

            return done;
        }

        private setupCharacter() {
            var self = this;
            self.sheet = self._characterService.getCreateCharacterSheet();
            self.sheet.currentStep = 0;

            self.sheet.nextStep = (data: ICreateCharacter) => {
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

            self._game.createCharacterSheet = self.sheet;
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

    CreateCharacterController.$inject = ['$scope', 'characterService', 'gameService', 'game', 'customTexts'];
}