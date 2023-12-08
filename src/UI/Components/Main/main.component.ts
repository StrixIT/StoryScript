import { IGame, IInterfaceTexts } from 'storyScript/Interfaces/storyScript';
import { SharedMethodService } from '../../Services/SharedMethodService';
import { ObjectFactory } from 'storyScript/ObjectFactory';
import { GameService } from 'storyScript/Services/gameService';
import { Component, ElementRef, Inject } from '@angular/core';
import { getTemplate } from '../../helpers';

@Component({
    selector: 'main',
    template: getTemplate('main', await import('./main.component.html'))
})
export class MainComponent {
    constructor(
        @Inject (ElementRef) private hostElement: ElementRef, 
        @Inject (SharedMethodService) private _sharedMethodService: SharedMethodService, 
        @Inject (GameService) private _gameService: GameService, 
        @Inject (ObjectFactory) objectFactory: ObjectFactory
    ) {
        this.game = objectFactory.GetGame();
        this.texts = objectFactory.GetTexts();
        this.game.UIRootElement = hostElement.nativeElement.parentNode;
        this._gameService.watchPlayState(this.stopAutoplay);
    }
    
    game: IGame;
    texts: IInterfaceTexts;

    showCharacterPane = (): boolean => this._sharedMethodService.useCharacterSheet || this._sharedMethodService.useEquipment || this._sharedMethodService.useBackpack || this._sharedMethodService.useQuests;

    private stopAutoplay = () => {
        var mediaElements = this.hostElement.nativeElement.querySelectorAll('audio:not(.storyscript-player), video:not(.storyscript-player)');
        mediaElements.forEach((m: HTMLAudioElement) => m.pause());
    }
}