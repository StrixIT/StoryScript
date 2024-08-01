import { Component, inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IGame, IInterfaceTexts, PlayState } from 'storyScript/Interfaces/storyScript';
import { GameService } from 'storyScript/Services/gameService';
import { ServiceFactory } from 'storyScript/ServiceFactory.ts';
import { getTemplate } from '../../helpers';
import {HelperService} from "storyScript/Services/helperService.ts";

@Component({
    selector: 'menu-modal',
    template: getTemplate('menumodal', await import('./menumodal.component.html'))
})
export class MenuModalComponent {
    private _activeModal: NgbActiveModal;
    private _gameService: GameService;
    private _helperService: HelperService;
    
    constructor() {
        this._activeModal = inject(NgbActiveModal);
        this._gameService = inject(GameService);
        this._helperService = inject(HelperService);
        const objectFactory = inject(ServiceFactory);
        this.game = objectFactory.GetGame();
        this.texts = objectFactory.GetTexts();
        this.state = PlayState.Menu;
    }

    texts: IInterfaceTexts;
    game: IGame;
    saveKeys: string[];
    selectedGame: string;
    state: string;

    closeModal = (): void => {
        this.setSelected(null);
        this.state = 'Menu';
        this.game.playState = null;
        this._activeModal.close();
    }

    restart = (): string => this.state = 'ConfirmRestart';

    cancel = (): void => {
        this.setSelected(null);
        this.state = 'Menu';
    }

    restartConfirmed = (): void => {
        this.closeModal();
        this._gameService.restart();
    }

    save = (): void => {
        this.saveKeys = this._gameService.getSaveGames();
        this.state = 'Save';
    }

    load = (): void => {
        this.saveKeys = this._gameService.getSaveGames();
        this.state = 'Load';
    }

    setSelected = (name: string): string => this.selectedGame = name;

    overwriteSelected = (): boolean => this._gameService.getSaveGames().indexOf(this.selectedGame) > -1;

    saveGame = (): void => {
        this._helperService.saveGame(this.selectedGame);
        this.closeModal();
    }

    loadGame = (): void => {
        this._gameService.loadGame(this.selectedGame);
        this.closeModal();
    }
}