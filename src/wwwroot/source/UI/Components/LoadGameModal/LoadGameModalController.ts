namespace StoryScript {   
    export class LoadGameModalController implements ng.IComponentController {
        constructor(private _scope: ng.IScope, private _gameService: IGameService, private _game: IGame, private _texts: IInterfaceTexts) {
            var self = this;
            self.texts = _texts;

            self._scope.$on('initLoadGame', (event, args) => {
                self.mode = 'load';
                self.openModal();
            });

            self._scope.$on('initSaveGame', (event, args) => {
                self.mode = 'save';
                self.openModal();
            });
        }

        saveKeys: string[];
        texts: IInterfaceTexts;
        selectedGame: string;
        mode: string;

        openModal = () => {
            var self = this;
            self.selectedGame = null;
            self.saveKeys = self._gameService.getSaveGames();
            $('#loadgame').modal('show');
        }

        closeModal = () => {
            var self = this;
            $('#loadgame').modal('hide');
        }

        setSelected = (name: string) => {
            var self = this;
            self.selectedGame = name;
        }

        saveGame = () => {
            var self = this;
            self._gameService.saveGame(self.selectedGame);
            self.closeModal();
        }

        loadGame = () => {
            var self = this;
            self._gameService.loadGame(self.selectedGame);
            self.closeModal();
        }
    }

    LoadGameModalController.$inject = ['$scope', 'gameService', 'game', 'customTexts'];
}