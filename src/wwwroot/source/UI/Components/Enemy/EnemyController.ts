namespace StoryScript {
   
    export class EnemyController implements ng.IComponentController {
        constructor(private _scope: ng.IScope, private _dataService: IDataService, private _game: IGame, private _texts: IInterfaceTexts) {
            var self = this;
            self.game = _game;
            self.texts = _texts;
        }

        game: IGame;
        texts: IInterfaceTexts;

        hasDescription(type: string, item: { id?: string, description?: string }) {
            var self = this;
            return self._dataService.hasDescription(type, item);
        }

        showDescription(item: any, title: string) {
            var self = this;

            if (item.description) {
                self.showDescriptionModal(title, item);
            }
        }

        startCombat = () => {
            var self = this;
            self.game.combatLog = [];
            self.game.state = GameState.Combat;
        }

        private showDescriptionModal(title: string, item: any) {
            var self = this;

            // Todo

            self.game.state = GameState.Description;
        }
    }

    EnemyController.$inject = ['$scope', 'dataService', 'game', 'customTexts'];
}