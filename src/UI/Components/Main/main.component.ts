import {IGame, IInterfaceTexts} from 'storyScript/Interfaces/storyScript';
import {SharedMethodService} from '../../Services/SharedMethodService';
import {ServiceFactory} from 'storyScript/ServiceFactory.ts';
import {GameService} from 'storyScript/Services/GameService';
import {Component, ElementRef, inject} from '@angular/core';
import {getTemplate} from '../../helpers';
import {CommonModule} from "@angular/common";
import {NavigationComponent} from "../Navigation/navigation.component.ts";
import {SoundComponent} from "../Sound/sound.component.ts";
import {PartyComponent} from "../Party/party.component.ts";
import {EncounterComponent} from "../Encounter/encounter.component.ts";
import {LocationTextComponent} from "../LocationText/locationtext.component.ts";
import {LocationVisualComponent} from "../LocationVisual/locationvisual.component.ts";
import {ActionLogComponent} from "../ActionLog/actionlog.component.ts";
import {GroundComponent} from "../Ground/ground.component.ts";
import {ExplorationComponent} from "../Exploration/exploration.component.ts";
import {EnemyComponent} from "../Enemy/enemy.component.ts";
import {IntroComponent} from "../Intro/intro.component.ts";
import {CreateCharacterComponent} from "../CreateCharacter/createcharacter.component.ts";
import {LevelUpComponent} from "../LevelUp/levelup.component.ts";
import {GameOverComponent} from "../GameOver/gameover.component.ts";
import {VictoryComponent} from "../Victory/victory.component.ts";
import {CombinationComponent} from "../Combination/combination.component.ts";
import {BackpackComponent} from "../Backpack/backpack.component.ts";
import {LocationMapComponent} from "../LocationMap/locationmap.component.ts";
import {FormsModule} from "@angular/forms";

@Component({
    standalone: true,
    selector: 'main',
    imports: [
        CommonModule,
        FormsModule,
        NavigationComponent,
        SoundComponent,
        BackpackComponent,
        PartyComponent,
        EncounterComponent,
        LocationTextComponent,
        LocationVisualComponent,
        LocationMapComponent,
        ActionLogComponent,
        GroundComponent,
        ExplorationComponent,
        EnemyComponent,
        IntroComponent,
        CreateCharacterComponent,
        LevelUpComponent,
        GameOverComponent,
        VictoryComponent,
        CombinationComponent
    ],
    template: getTemplate('main', await import('./main.component.html?raw'))
})
export class MainComponent {
    private readonly _sharedMethodService: SharedMethodService;
    private readonly _gameService: GameService;
    private readonly _hostElement: ElementRef;

    constructor() {
        const objectFactory = inject(ServiceFactory);
        this._hostElement = inject(ElementRef);
        this._sharedMethodService = inject(SharedMethodService)
        this._gameService = inject(GameService);
        this._gameService.init();

        this.game = objectFactory.GetGame();
        this.texts = objectFactory.GetTexts();
        this.game.UIRootElement = this._hostElement.nativeElement.parentNode;
        this._gameService.watchPlayState(this.stopAutoplay);
    }

    game: IGame;
    texts: IInterfaceTexts;

    showCharacterPane = (): boolean => this._sharedMethodService.useCharacterSheet || this._sharedMethodService.useEquipment || this._sharedMethodService.useBackpack || this._sharedMethodService.useQuests;

    private readonly stopAutoplay = () => {
        const mediaElements = this._hostElement.nativeElement.querySelectorAll('audio:not(.storyscript-player), video:not(.storyscript-player)');
        mediaElements.forEach((m: HTMLAudioElement) => m.pause());
    }
}