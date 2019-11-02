import StoryScript from '../../../../../types/storyscript';
import { ISharedMethodService } from '../../Services/SharedMethodService';

export class CharacterSheetController {
    constructor(private _characterService: StoryScript.ICharacterService, private _sharedMethodService: ISharedMethodService, _game: StoryScript.IGame, _texts: StoryScript.IInterfaceTexts) {
        this.game = _game;
        this.texts = _texts;
        this.displayCharacterAttributes = this._characterService.getSheetAttributes();
        this._sharedMethodService.useCharacterSheet = true;
    }

    game: StoryScript.IGame;
    texts: StoryScript.IInterfaceTexts;
    displayCharacterAttributes: string[];
}

CharacterSheetController.$inject = ['characterService', 'sharedMethodService', 'game', 'customTexts'];