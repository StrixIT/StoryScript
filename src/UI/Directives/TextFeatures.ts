import { IGame, IFeature, PlayState } from 'storyScript/Interfaces/storyScript';
import { compareString } from 'storyScript/globals';
import { addHtmlSpaces } from 'storyScript/utilities';
import { CombinationService } from 'storyScript/Services/CombinationService';
import { GameService } from 'storyScript/Services/gameService';
import { ObjectFactory } from 'storyScript/ObjectFactory';
import { Directive, ElementRef, Renderer2, HostListener, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { SharedMethodService } from '../Services/SharedMethodService';

@Directive({ selector: '[textFeatures]' })
export class TextFeatures  implements OnDestroy {
    constructor(private _sharedMethodService: SharedMethodService, private _combinationService: CombinationService, private _gameService: GameService, private _elem: ElementRef, private _renderer: Renderer2, objectFactory: ObjectFactory) {
        this.game = objectFactory.GetGame();
        this._combinationSubscription = this._sharedMethodService.combinationChange$.subscribe(p => this.refreshFeatures(p));
        this.refreshFeatures(true);

        this.changes = new MutationObserver((mutations: MutationRecord[]) => {
            mutations.forEach((mutation: MutationRecord) => this.refreshFeatures(true));
        });
  
        this.changes.observe(_elem.nativeElement, {
            attributes: true,
            childList: true,
            characterData: true
        });

        // This watcher is needed to show hidden features when a game is loaded.
        this._gameService.watchPlayState((game: IGame, newPlayState: PlayState, oldplayState: PlayState) => {
            if (oldplayState === PlayState.Menu && newPlayState === null) {
                setTimeout(() => {
                    this.refreshFeatures(true);
                }, 0);
            }
        });
    }

    private changes: MutationObserver;
    private _combinationSubscription: Subscription;
    
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

    private refreshFeatures = (newValue: boolean) => {
        if (newValue) {
            // Show the text of added features.
            const features = this._elem.nativeElement.getElementsByTagName('feature');
            const featureArray = Array.prototype.slice.call(features);

            featureArray.filter((e) => e.innerHTML.trim() === '')
                .map((e) => {
                    var feature = this.game.currentLocation.features.get(e.getAttribute('name'));

                    if (feature) {
                        this.game.currentLocation.description = this.game.currentLocation.description.replace(new RegExp('<feature name="' + feature.id +'">\s*<\/feature>'), '<feature name="' + feature.id +'">' + addHtmlSpaces(feature.description) + '<\/feature>');
                    }
                });
            
            // Remove the text of deleted features.
            featureArray.filter((e) => e.innerHTML.trim() !== '')
                .map((e) => {
                    if (this.game.combinations.combinationResult.featuresToRemove.indexOf(e.getAttribute('name')) > -1) {
                        e.innerHTML = '';
                    }
                });

            featureArray.forEach((e) => {
                this._renderer.removeClass(e, 'combine-active-selected');
            });
        }
    };

    private click = (ev: any) => {
        if (this.isFeatureNode(ev)) {
            var feature = this.getFeature(ev);

            if (feature) {
                var result = this.game.combinations.tryCombine(feature);
                this._sharedMethodService.setCombineState(result);
                this.addCombineClass(ev, feature);
            }
        }
    }

    private mouseOver = (ev: any) => {
        if (this.isFeatureNode(ev)) {
            var feature = this.getFeature(ev);
            this.addCombineClass(ev, feature);
        }
    };

    private isFeatureNode = (ev: any): boolean  => {
        var nodeType = ev.target && ev.target.nodeName;
        return compareString(nodeType, 'feature');
    }

    private getFeature = (ev: any): IFeature => {
        var featureName = ev.target.getAttribute('name');
        return this.game.currentLocation.features.get(featureName);
    }

    private addCombineClass = (ev: any, feature: IFeature) => {
        var combineClass= this._combinationService.getCombineClass(feature);

        if (combineClass) {
            this._renderer.addClass(ev.target, combineClass);
        }
    }
}