namespace StoryScript {
    export class MenuModalController implements ng.IComponentController {
        constructor(private _scope: ng.IScope, private _sharedMethodService: ISharedMethodService, private _texts: IInterfaceTexts) {
            var self = this;
            self.texts = _texts;

            self._scope.$on('initMenu', (event, args) => {
                self.openModal();
            });
    
        }

        texts: IInterfaceTexts;
        game: IGame;

        openModal = () => {
            $('#menumodal').modal('show');
        }

        closeModal = () => {
            $('#menumodal').modal('hide');
        }

        useSaveGames = (): boolean => {
            var self = this;
            return self._sharedMethodService.useSaveGames;
        }

        restart = (): void => {
            var self = this;
            self._scope.$emit('restart');
            self.closeModal();
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

    MenuModalController.$inject = ['$scope', 'sharedMethodService', 'customTexts'];
}