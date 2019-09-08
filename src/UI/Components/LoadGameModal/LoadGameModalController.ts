namespace StoryScript {   
    export class LoadGameModalController implements ng.IComponentController {
        constructor(private _scope: ng.IScope, private _gameService: IGameService, private _sharedMethodService: ISharedMethodService, private _game: IGame, private _texts: IInterfaceTexts) {
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

            self._sharedMethodService.useSaveGames = true;
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

        overwriteSelected = () => {
            var self = this;
            return self._gameService.getSaveGames().indexOf(this.selectedGame) > -1;
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

    LoadGameModalController.$inject = ['$scope', 'gameService', 'sharedMethodService', 'game', 'customTexts'];
}