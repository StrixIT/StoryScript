namespace StoryScript {
    export class MenuModalController implements ng.IComponentController {
        private _state: GameState;

        constructor(private _scope: ng.IScope, private _sharedMethodService: ISharedMethodService, private _game: IGame, private _texts: IInterfaceTexts) {
            var self = this;
            self.texts = _texts;

            self._scope.$on('initMenu', (event, args) => {
                self.openModal();
            });
        }

        texts: IInterfaceTexts;
        game: IGame;
        confirmRestart: boolean;

        openModal = () => {
            var self = this;
            self._state = self._game.state;
            self._game.state = GameState.Menu;
            $('#menumodal').modal('show');
        }

        closeModal = () => {
            var self = this;
            self._game.state = self._state;
            $('#menumodal').modal('hide');
        }

        useSaveGames = (): boolean => {
            var self = this;
            return self._sharedMethodService.useSaveGames;
        }

        restart = (): void => {
            var self = this;
            self.confirmRestart = true;
        }

        restartCancelled = (): void => {
            var self = this;
            self.confirmRestart = false;
        }

        restartConfirmed = (): void => {
            var self = this;
            self.confirmRestart = false;
            self.closeModal();
            self._scope.$emit('restart');
        }

        save = (): void => {
            var self = this;
            self._scope.$emit('saveGame');
        }

        load = (): void => {
            var self = this;
            self._scope.$emit('loadGame');
        }
    }

    MenuModalController.$inject = ['$scope', 'sharedMethodService', 'game', 'customTexts'];
}