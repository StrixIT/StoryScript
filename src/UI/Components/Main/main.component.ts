import { IGame, IInterfaceTexts, PlayState } from 'storyScript/Interfaces/storyScript';
import { SharedMethodService } from '../../Services/SharedMethodService';
import { ObjectFactory } from 'storyScript/ObjectFactory';
import { GameService } from 'storyScript/Services/gameService';
import { Component, ElementRef } from '@angular/core';
import { getTemplate } from '../../helpers';

@Component({
    selector: 'main',
    template: getTemplate('main', require('./main.component.html'))
})
export class MainComponent {
    constructor(private hostElement: ElementRef, private _sharedMethodService: SharedMethodService, private _gameService: GameService, objectFactory: ObjectFactory) {
        this.game = objectFactory.GetGame();
        this.texts = objectFactory.GetTexts();
        this.game.UIRootElement = hostElement.nativeElement.parentNode;
        this._gameService.watchPlayState(this.stopAutoplay);
    }
    
    game: IGame;
    texts: IInterfaceTexts;

    showCharacterPane = (): boolean => this._sharedMethodService.useCharacterSheet || this._sharedMethodService.useEquipment || this._sharedMethodService.useBackpack || this._sharedMethodService.useQuests;

    private stopAutoplay = (game: IGame, newPlayState: PlayState, oldPlayState: PlayState) => {
        var mediaElements = this.hostElement.nativeElement.querySelectorAll('audio:not(.storyscript-player), video:not(.storyscript-player)');
        mediaElements.forEach((m: HTMLAudioElement) => m.pause());
    }
}