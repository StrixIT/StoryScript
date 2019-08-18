namespace StoryScript {   
    export class GroundController implements ng.IComponentController {
        constructor(private _sharedMethodService: ISharedMethodService, private _game: IGame, private _texts: IInterfaceTexts) {
            var self = this;
            self.game = _game;
            self.texts = _texts;
            self._sharedMethodService.useGround = true;
        }

        game: IGame;
        texts: IInterfaceTexts;

        enemiesPresent = () => {
            var self = this;
            return self._sharedMethodService.enemiesPresent();
        }

        getCombineClass = (barrier: IBarrier) => {
            var self = this;
            return self._game.combinations.getCombineClass(barrier);
        }

        pickupItem = (item: IItem): void => {
            var self = this;
            var isCombining = self._game.combinations.activeCombination;

            if (isCombining) {
                self._game.combinations.tryCombine(item)
                return;
            }

            self.game.character.items.push(item);
            self.game.currentLocation.items.remove(item);
        }
    }

    GroundController.$inject = ['sharedMethodService', 'game', 'customTexts'];
}