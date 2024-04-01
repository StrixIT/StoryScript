import { IGame, IInterfaceTexts, PlayState } from 'storyScript/Interfaces/storyScript';
import { GameService } from 'storyScript/Services/gameService';
import { ObjectFactory } from 'storyScript/ObjectFactory';
import { Component, ViewChild, inject } from '@angular/core';
import { getTemplate } from '../../helpers';
import { Observable, OperatorFunction, Subject, debounceTime, distinctUntilChanged, filter, map, merge, switchMap } from 'rxjs';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'navigation',
    template: getTemplate('navigation', await import('./navigation.component.html'))
})
export class NavigationComponent {
    private _gameService: GameService;

    constructor() {
        this._gameService = inject(GameService);
        const objectFactory = inject(ObjectFactory);
        this.game = objectFactory.GetGame();
        this.texts = objectFactory.GetTexts();
        this.locations = this.game.definitions['locations'].map(l => {
            return { id: l.name.toLowerCase(), name: l.name}
        });
    }

    game: IGame;
    texts: IInterfaceTexts;
    locations: { id: string, name: string }[];

    menu = (): void => {
        this.game.playState = PlayState.Menu;
    }

    reset = (): void => this._gameService.reset();

    model: any;
    @ViewChild('instance', { static: true }) instance: NgbTypeahead;

    focus$ = new Subject<string>();
	click$ = new Subject<string>();

    formatter = (result: { id: string, name: string }) => {
        return result.name;
    }

	search: OperatorFunction<string, readonly { id: string, name: string }[]> = (text$: Observable<string>) => {
		const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
		const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.instance?.isPopupOpen()));
		const inputFocus$ = this.focus$;

		return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
			map((term) =>
                this.locations.filter(l => l.id?.indexOf(term?.toLowerCase()) > -1) 
			),
		);
	};

    jumpToLocation= ($event: { preventDefault: Function, item: { id: string, name: string } }) => {
        $event.preventDefault();
        this.model = null;
        this.game.changeLocation($event.item.id, true);
    }
}