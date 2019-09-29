namespace StoryScript {
    export class MenuModalController implements ng.IComponentController {

        constructor(private _scope: ng.IScope, private _sharedMethodService: ISharedMethodService, private _gameService: IGameService, private _game: IGame, private _texts: IInterfaceTexts) {
            var self = this;
            self.texts = _texts;
            self.game = _game;
            self.state = 'Menu';

            self._scope.$on('showMenu', (event, args) => {
                self.openModal();
            });
        }

        texts: IInterfaceTexts;
        game: IGame;
        saveKeys: string[];
        selectedGame: string;
        state: string;

        openModal = () => {
            var self = this;
            self._game.playState = PlayState.Menu;
            $('#menumodal').modal('show');
        }

        closeModal = () => {
            var self = this;
            self.setSelected(null);
            self.state = 'Menu';
            self._game.playState = null;
            $('#menumodal').modal('hide');
        }

        restart = (): void => {
            var self = this;
            self.state = 'ConfirmRestart';
        }

        cancel = (): void => {
            var self = this;
            self.setSelected(null);
            self.state = 'Menu';
        }

        restartConfirmed = (): void => {
            var self = this;
            self.closeModal();
            self._scope.$emit('restart');
        }

        save = (): void => {
            var self = this;
            self.saveKeys = self._gameService.getSaveGames();
            self.state = 'Save';
        }

        load = (): void => {
            var self = this;
            self.saveKeys = self._gameService.getSaveGames();
            self.state = 'Load';
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
            self._scope.$emit('gameLoaded');
        }
    }

    MenuModalController.$inject = ['$scope', 'sharedMethodService', 'gameService', 'game', 'customTexts'];
}