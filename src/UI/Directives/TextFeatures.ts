import {IFeature, IGame, PlayState} from 'storyScript/Interfaces/storyScript';
import {addHtmlSpaces, compareString} from 'storyScript/utilityFunctions';
import {CombinationService} from 'storyScript/Services/CombinationService';
import {GameService} from 'storyScript/Services/GameService';
import {ServiceFactory} from 'storyScript/ServiceFactory.ts';
import {Directive, ElementRef, HostListener, inject, OnDestroy, Renderer2} from '@angular/core';
import {Subscription} from 'rxjs';
import {SharedMethodService} from '../Services/SharedMethodService';

@Directive({
    standalone: true,
    selector: '[textFeatures]'
})
export class TextFeatures implements OnDestroy {
    private readonly _sharedMethodService: SharedMethodService;
    private readonly _combinationService: CombinationService;
    private readonly _gameService: GameService;
    private readonly _elem: ElementRef;
    private readonly _renderer: Renderer2;

    constructor() {
        this._sharedMethodService = inject(SharedMethodService);
        this._combinationService = inject(CombinationService);
        this._gameService = inject(GameService);
        this._elem = inject(ElementRef);
        this._renderer = inject(Renderer2);
        const objectFactory = inject(ServiceFactory);
        this.game = objectFactory.GetGame();
        this._combinationSubscription = this._sharedMethodService.combinationChange$.subscribe(p => this.refreshFeatures(p));
        this.refreshFeatures(true);

        this.changes = new MutationObserver((mutations: MutationRecord[]) => {
            mutations.forEach((_) => this.refreshFeatures(true));
        });

        this.changes.observe(this._elem.nativeElement, {
            attributes: true,
            childList: true,
            characterData: true
        });

        // This watcher is needed to show hidden features when a game is loaded.
        this._gameService.watchPlayState((_, newPlayState: PlayState, oldPlayState: PlayState) => {
            if (oldPlayState === PlayState.Menu && newPlayState === null) {
                setTimeout(() => {
                    this.refreshFeatures(true);
                }, 0);
            }
        });
    }

    private readonly changes: MutationObserver;
    private readonly _combinationSubscription: Subscription;

    game: IGame;

    ngOnDestroy(): void {
        this._combinationSubscription.unsubscribe();
    }

    @HostListener('click', ['$event']) onClick($event: any) {
        this.click($event);
    }

    @HostListener('mouseover', ['$event']) onMouseOver($event: any) {
        this.mouseOver($event);
    }

    private readonly refreshFeatures = (newValue: boolean) => {
        if (newValue) {
            // Show the text of added features.
            const features = this._elem.nativeElement.getElementsByTagName('feature');
            const featureArray = Array.prototype.slice.call(features);

            featureArray.filter((e) => e.innerHTML.trim() === '')
                .forEach((e) => {
                    const feature = this.game.currentLocation.features.get(e.getAttribute('name'));

                    if (feature) {
                        this.game.currentLocation.description = this.game.currentLocation.description.replace(new RegExp('<feature name="' + feature.id + '">\s*<\/feature>'), '<feature name="' + feature.id + '">' + addHtmlSpaces(feature.description) + '<\/feature>');
                    }
                });

            // Remove the text of deleted features.
            featureArray.filter((e) => e.innerHTML.trim() !== '')
                .forEach((e) => {
                    if (this.game.combinations.combinationResult.featuresToRemove.indexOf(e.getAttribute('name')) > -1) {
                        e.innerHTML = '';
                    }
                });

            featureArray.forEach((e) => {
                this._renderer.removeClass(e, 'combine-active-selected');
                this._renderer.addClass(e, 'combine-selectable');
            });
        }
    };

    private readonly click = (ev: any) => {
        if (this.isFeatureNode(ev)) {
            const feature = this.getFeature(ev);

            if (feature) {
                const result = this.game.combinations.tryCombine(feature);
                this._sharedMethodService.setCombineState(result.success);
                this.addCombineClass(ev, feature);
            }
        }
    }

    private readonly mouseOver = (ev: any) => {
        if (this.isFeatureNode(ev)) {
            const feature = this.getFeature(ev);
            this.addCombineClass(ev, feature);
        }
    };

    private readonly isFeatureNode = (ev: any): boolean => {
        const nodeType = ev.target && ev.target.nodeName;
        return compareString(nodeType, 'feature');
    }

    private readonly getFeature = (ev: any): IFeature => {
        const featureName = ev.target.getAttribute('name');
        return this.game.currentLocation.features.get(featureName);
    }

    private readonly addCombineClass = (ev: any, feature: IFeature) => {
        const combineClass = this._combinationService.getCombineClass(feature);

        if (combineClass) {
            this._renderer.addClass(ev.target, combineClass);
        }
    }
}