import { ISharedMethodService } from '../../Services/SharedMethodService';

export class GroundController implements ng.IComponentController {
    constructor(private _sharedMethodService: ISharedMethodService, private _characterService: StoryScript.ICharacterService, private _game: StoryScript.IGame, _texts: StoryScript.IInterfaceTexts) {
        this.game = _game;
        this.texts = _texts;
        this._sharedMethodService.useGround = true;
    }

    game: StoryScript.IGame;
    texts: StoryScript.IInterfaceTexts;

    enemiesPresent = (): boolean => this._sharedMethodService.enemiesPresent();

    getCombineClass = (barrier: StoryScript.IBarrier): string => this._game.combinations.getCombineClass(barrier);

    pickupItem = (item: StoryScript.IItem): boolean => this._characterService.pickupItem(item);
}

GroundController.$inject = ['sharedMethodService', 'characterService', 'game', 'customTexts'];