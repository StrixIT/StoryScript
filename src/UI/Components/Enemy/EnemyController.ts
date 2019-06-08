namespace StoryScript {
   
    export class EnemyController implements ng.IComponentController {
        constructor(private _scope: ng.IScope, private _gameService: IGameService, private _sharedMethodService: ISharedMethodService, private _game: IGame, private _texts: IInterfaceTexts) {
            var self = this;
            self.game = _game;
            self.texts = _texts;
        }

        game: IGame;
        texts: IInterfaceTexts;

        getCombineClass = (item: IItem) => {
            var self = this;
            return self._game.combinations.getCombineClass(item);
        }

        tryCombine = (enemy: IEnemy) => {
            var self = this;
            self._game.combinations.tryCombine(enemy);
        }

        hasDescription(type: string, item: { id?: string, description?: string }) {
            var self = this;
            return self._gameService.hasDescription(type, item);
        }

        showDescription(item: any, title: string) {
            var self = this;
            self._sharedMethodService.showDescription(self._scope, 'enemies', item, title);
        }

        startCombat = (enemy: IEnemy) => {
            var self = this;
            self._sharedMethodService.startCombat();
        }
    }

    EnemyController.$inject = ['$scope', 'gameService', 'sharedMethodService', 'game', 'customTexts'];
}