import {addHtmlSpaces, compareString} from "storyScript/utilityFunctions.ts";
import {IFeature} from "storyScript/Interfaces/feature.ts";
import {useStateStore} from "ui/StateStore.ts";
import {Ref, watch} from "vue";
import {storeToRefs} from "pinia";

export function useTextFeatures(descriptionRef: Ref<HTMLDivElement>) {
    const touchDevice = navigator.maxTouchPoints > 0;
    
    const store = useStateStore();
    const {game} = storeToRefs(store);
    const {combinationService} = store.services;

    const description = descriptionRef;

    watch(() => game.value.combinations.activeCombination?.selectedTool, (newValue) => {
        refreshFeatures();
    });

    const refreshFeatures = () => {
        // Show the text of added features.
        const featureArray = getFeatureArray();

        if (featureArray.length === 0) {
            return;
        }

        featureArray.filter(e => e.innerHTML.trim() === '')
            .forEach((e) => {
                const feature = game.value.currentLocation.features.get(e.getAttribute('name'));

                if (feature) {
                    game.value.currentLocation.description = game.value.currentLocation.description.replace(new RegExp('<feature name="' + feature.id + '">\s*<\/feature>'), '<feature name="' + feature.id + '">' + addHtmlSpaces(feature.description) + '<\/feature>');
                }
            });

        // Remove the text of deleted features.
        featureArray.filter(e => e.innerHTML.trim() !== '')
            .forEach((e) => {
                if (game.value.combinations.combinationResult.featuresToRemove.indexOf(e.getAttribute('name')) > -1) {
                    e.innerHTML = '';
                }
            });

        featureArray.forEach((e) => {
            e.classList.remove('combine-active-selected', 'combine-selectable');
            
            if (game.value.combinations.activeCombination) {
                e.classList.add('combine-selectable');
            }
        });
    };

    const isFeatureNode = (ev: MouseEvent): boolean => {
        const nodeType = ev.target && (<any>ev.target).nodeName;
        return compareString(nodeType, 'feature');
    }

    const addClass = (ev: MouseEvent, className: string): void => {
        if (className) {
            (<any>ev.target).classList.add(className);
        }
    }

    const removeClass = (ev: MouseEvent, className: string): void => {
        if (className) {
            (<any>ev.target).classList.remove(className);
        }
    }
    
    const addCombineClass = (ev: MouseEvent, feature: IFeature) => {
        addClass(ev, combinationService.getCombineClass(feature));
    }

    const click = (ev: PointerEvent) => {
        if (isFeatureNode(ev)) {
            const feature = getFeature(ev);

            if (feature) {
                const result = game.value.combinations.tryCombine(feature);
                addCombineClass(ev, feature);

                if (result.success) {
                    refreshFeatures();
                }
                
                if (touchDevice) {
                    const activate = !feature.active;
                    
                    game.value.currentLocation.features.forEach(f => {
                        feature.active = false;
                        removeClass(ev, 'feature-active');
                        feature?.deactivate?.(game.value);
                    });
                    
                    if (activate) {
                        feature.active = true;
                        addClass(ev, 'feature-active');
                        feature.activate?.(game.value);
                    }
                }
            }
        }
    }

    const mouseOver = (ev: MouseEvent) => {
        if (isFeatureNode(ev)) {
            const feature = getFeature(ev);
            addCombineClass(ev, feature);
            
            if (!touchDevice && !feature.active) {
                feature.active = true;
                addClass(ev, 'feature-active');
                feature?.activate?.(game.value);
            }
        }
    };

    const mouseOut = (ev: MouseEvent) => {
        if (isFeatureNode(ev)) {
            const feature = getFeature(ev);

            if (!touchDevice && feature?.active) {
                feature.active = false;
                removeClass(ev, 'feature-active');
                feature.deactivate?.(game.value);
            }
        }
    };

    const getFeature = (ev: MouseEvent): IFeature => {
        const featureName = (<any>ev.target).getAttribute('name');
        return game.value.currentLocation.features.get(featureName);
    }

    const getFeatureArray = (): HTMLElement[] => {
        const features = description.value?.getElementsByTagName('feature');

        if (!features) {
            return [];
        }

        return Array.prototype.slice.call(features) as HTMLElement[];
    }

    return {
        description,
        refreshFeatures,
        click,
        mouseOver,
        mouseOut
    }
}