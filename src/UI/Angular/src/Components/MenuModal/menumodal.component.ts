import { IGame, IInterfaceTexts, Enumerations } from '../../../../../Engine/Interfaces/storyScript';
import { SharedMethodService } from '../../Services/SharedMethodService';
import { GameService } from '../../../../../Engine/Services/gameService';
import { ObjectFactory } from '../../../../../Engine/ObjectFactory';
import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import template from './menumodal.component.html';

@Component({
    selector: 'menu-modal',
    template: template,
})
export class MenuModalComponent implements OnDestroy {
    constructor(private _gameService: GameService, sharedMethodService: SharedMethodService, objectFactory: ObjectFactory) {
        this.game = objectFactory.GetGame();
        this.texts = objectFactory.GetTexts();
        this.state = Enumerations.PlayState.Menu;

        this._playStateSubscription = sharedMethodService.playStateChange$.subscribe(p => this.watchPlayState(p));
    }

    private _playStateSubscription: Subscription;

    texts: IInterfaceTexts;
    game: IGame;
    saveKeys: string[];
    selectedGame: string;
    state: string;

    ngOnDestroy(): void {
        this._playStateSubscription.unsubscribe();
    }

    openModal = (): JQLite => $('#menumodal').modal('show');

    closeModal = (): void => {
        this.setSelected(null);
        this.state = 'Menu';
        this.game.playState = null;
        $('#menumodal').modal('hide');
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
        this._gameService.saveGame(this.selectedGame);
        this.closeModal();
    }

    loadGame = (): void => {
        this._gameService.loadGame(this.selectedGame);
        this.closeModal();
    }

    private watchPlayState = (newValue: Enumerations.PlayState) => {
        if (newValue == Enumerations.PlayState.Menu) {
            this.openModal();
        }
    }
}