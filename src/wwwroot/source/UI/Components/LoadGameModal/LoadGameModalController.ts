namespace StoryScript {   
    export class LoadGameModalController implements ng.IComponentController {
        constructor(private _scope: ng.IScope, private _gameService: IGameService, private _game: IGame, private _texts: IInterfaceTexts) {
            var self = this;
            self.texts = _texts;

            self._scope.$on('initLoadGame', (event, args) => {
                self.openModal();
            });
        }

        saveKeys: string[];
        texts: IInterfaceTexts;
        selectedGame: string;

        openModal = () => {
            var self = this;
            self.saveKeys = self._gameService.getSaveGames();
            $('#loadgame').modal('show');
        }

        closeModal = () => {
            var self = this;
            $('#loadgame').modal('hide');
        }

        loadGame = () => {
            var self = this;
        }
    }

    LoadGameModalController.$inject = ['$scope', 'gameService', 'game', 'customTexts'];
}