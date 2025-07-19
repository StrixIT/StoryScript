import {Component, inject} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {IGame, IInterfaceTexts, PlayState} from 'storyScript/Interfaces/storyScript';
import {GameService} from 'storyScript/Services/GameService';
import {ServiceFactory} from 'storyScript/ServiceFactory.ts';
import {getTemplate} from '../../helpers';
import {DataService} from "storyScript/Services/DataService.ts";
import {SharedModule} from "ui/Modules/sharedModule.ts";

@Component({
    standalone: true,
    selector: 'menu-modal',
    imports: [SharedModule],
    template: getTemplate('menumodal', await import('./menumodal.component.html?raw'))
})
export class MenuModalComponent {
    private readonly _activeModal: NgbActiveModal;
    private readonly _gameService: GameService;
    private readonly _dataService: DataService;

    constructor() {
        this._activeModal = inject(NgbActiveModal);
        this._gameService = inject(GameService);
        this._dataService = inject(DataService);
        const objectFactory = inject(ServiceFactory);
        this.game = objectFactory.GetGame();
        this.texts = objectFactory.GetTexts();
        this.state = PlayState.Menu;
    }

    game: IGame;
    texts: IInterfaceTexts;
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
        this.saveKeys = this._dataService.getSaveKeys();
        this.state = 'Save';
    }

    load = (): void => {
        this.saveKeys = this._dataService.getSaveKeys();
        this.state = 'Load';
    }

    setSelected = (name: string): string => this.selectedGame = name;

    overwriteSelected = (): boolean => this._dataService.getSaveKeys().indexOf(this.selectedGame) > -1;

    saveGame = (): void => {
        this._dataService.saveGame(this.game, this.selectedGame);
        this.closeModal();
    }

    loadGame = (): void => {
        this._gameService.loadGame(this.selectedGame);
        this.closeModal();
    }
}