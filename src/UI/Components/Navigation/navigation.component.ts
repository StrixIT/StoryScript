import {IGame, IInterfaceTexts, PlayState} from 'storyScript/Interfaces/storyScript';
import {GameService} from 'storyScript/Services/GameService';
import {ServiceFactory} from 'storyScript/ServiceFactory.ts';
import {Component, inject, ViewChild} from '@angular/core';
import {getTemplate} from '../../helpers';
import {debounceTime, distinctUntilChanged, filter, map, merge, Observable, OperatorFunction, Subject} from 'rxjs';
import {NgbTypeahead} from '@ng-bootstrap/ng-bootstrap';
import {SharedModule} from "ui/Modules/sharedModule.ts";

@Component({
    standalone: true,
    selector: 'navigation',
    imports: [SharedModule, NgbTypeahead],
    template: getTemplate('navigation', await import('./navigation.component.html?raw'))
})
export class NavigationComponent {
    private readonly _gameService: GameService;

    constructor() {
        this._gameService = inject(GameService);
        const serviceFactory = inject(ServiceFactory);
        this.game = serviceFactory.GetGame();
        this.texts = serviceFactory.GetTexts();
        this.locations = serviceFactory.AvailableLocations.sort((a, b) => a.name.localeCompare(b.name));
    }

    game: IGame;
    texts: IInterfaceTexts;
    locations: { id: string, name: string }[];

    menu = (): void => {
        this.game.playState = PlayState.Menu;
    }

    reset = (): void => this._gameService.reset();

    model: any;
    @ViewChild('instance', {static: true}) instance: NgbTypeahead;

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

    jumpToLocation = ($event: { preventDefault: Function, item: { id: string, name: string } }) => {
        $event.preventDefault();
        this.model = null;
        this.game.changeLocation($event.item.id, true);
    }
}