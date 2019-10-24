namespace StoryScript {   
    export class GroundController implements ng.IComponentController {
        constructor(private _sharedMethodService: ISharedMethodService, private _characterService: ICharacterService, private _game: IGame, _texts: IInterfaceTexts) {
            this.game = _game;
            this.texts = _texts;
            this._sharedMethodService.useGround = true;
        }

        game: IGame;
        texts: IInterfaceTexts;

        enemiesPresent = (): boolean => this._sharedMethodService.enemiesPresent();

        getCombineClass = (barrier: IBarrier): string => this._game.combinations.getCombineClass(barrier);

        pickupItem = (item: IItem): boolean => this._characterService.pickupItem(item);
    }

    GroundController.$inject = ['sharedMethodService', 'characterService', 'game', 'customTexts'];
}