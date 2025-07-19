import {IGame, IInterfaceTexts, IItem, IPerson, ITrade} from 'storyScript/Interfaces/storyScript';
import {SharedMethodService} from '../../Services/SharedMethodService';
import {ServiceFactory} from 'storyScript/ServiceFactory.ts';
import {Component, inject} from '@angular/core'
import {getTemplate} from '../../helpers';
import {SharedModule} from "ui/Modules/sharedModule.ts";

@Component({
    standalone: true,
    selector: 'encounter',
    imports: [SharedModule],
    template: getTemplate('encounter', await import('./encounter.component.html?raw'))
})
export class EncounterComponent {
    private readonly _sharedMethodService: SharedMethodService;

    constructor() {
        this._sharedMethodService = inject(SharedMethodService);
        const objectFactory = inject(ServiceFactory);
        this.game = objectFactory.GetGame();
        this.texts = objectFactory.GetTexts();
    }

    game: IGame;
    texts: IInterfaceTexts;

    enemiesPresent = (): boolean => this._sharedMethodService.enemiesPresent();

    personsPresent = (): boolean => this.game.currentLocation?.activePersons?.length > 0;

    hasDescription = (person: IPerson): boolean => this._sharedMethodService.hasDescription(person);

    showDescription = (person: IPerson, title: string): void => this._sharedMethodService.showDescription('person', person, title);

    getCombineClass = (item: IItem): string => this.game.combinations.getCombineClass(item);

    tryCombine = (person: IPerson): boolean => this._sharedMethodService.tryCombine(person);

    talk = (person: IPerson): void => this._sharedMethodService.talk(person);

    trade = (trade: IPerson | ITrade): boolean => this._sharedMethodService.trade(trade);

    startCombat = (person: IPerson): void => this._sharedMethodService.startCombat(person);
}