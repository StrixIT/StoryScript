namespace StoryScript {
   
    export class EnemyController implements ng.IComponentController {
        constructor(private _scope: ng.IScope, private _gameService: IGameService, private _sharedMethodService: ISharedMethodService, private _game: IGame, private _texts: IInterfaceTexts) {
            var self = this;
            self.game = _game;
            self.texts = _texts;
        }

        game: IGame;
        texts: IInterfaceTexts;

        hasDescription(type: string, item: { id?: string, description?: string }) {
            var self = this;
            return self._gameService.hasDescription(type, item);
        }

        showDescription(item: any, title: string) {
            var self = this;

            if (item.description) {
                self.showDescriptionModal(title, item);
            }
        }

        startCombat = (enemy: ICompiledEnemy) => {
            var self = this;
            self._sharedMethodService.startCombat();
        }

        private showDescriptionModal(title: string, item: any) {
            var self = this;

            // Todo

            self.game.state = GameState.Description;
        }
    }

    EnemyController.$inject = ['$scope', 'gameService', 'sharedMethodService', 'game', 'customTexts'];
}