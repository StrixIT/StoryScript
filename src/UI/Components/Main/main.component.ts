import { IGame, IInterfaceTexts } from 'storyScript/Interfaces/storyScript';
import { SharedMethodService } from '../../Services/SharedMethodService';
import { ServiceFactory } from 'storyScript/ServiceFactory.ts';
import { GameService } from 'storyScript/Services/GameService';
import { Component, ElementRef, inject } from '@angular/core';
import { getTemplate } from '../../helpers';

@Component({
    selector: 'main',
    template: getTemplate('main', await import('./main.component.html?raw'))
})
export class MainComponent {
    private _sharedMethodService: SharedMethodService;
    private _gameService: GameService;
    private _hostElement: ElementRef;

    constructor() {
        const objectFactory = inject(ServiceFactory);
        this._hostElement = inject(ElementRef);
        this._sharedMethodService= inject(SharedMethodService)
        this._gameService= inject(GameService);

        this.game = objectFactory.GetGame();
        this.texts = objectFactory.GetTexts();
        this.game.UIRootElement = this._hostElement.nativeElement.parentNode;
        this._gameService.watchPlayState(this.stopAutoplay);
    }
    
    game: IGame;
    texts: IInterfaceTexts;

    showCharacterPane = (): boolean => this._sharedMethodService.useCharacterSheet || this._sharedMethodService.useEquipment || this._sharedMethodService.useBackpack || this._sharedMethodService.useQuests;

    private stopAutoplay = () => {
        var mediaElements = this._hostElement.nativeElement.querySelectorAll('audio:not(.storyscript-player), video:not(.storyscript-player)');
        mediaElements.forEach((m: HTMLAudioElement) => m.pause());
    }
}