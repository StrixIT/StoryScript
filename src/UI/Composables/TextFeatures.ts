import {addHtmlSpaces, compareString} from "storyScript/utilityFunctions.ts";
import {IFeature} from "storyScript/Interfaces/feature.ts";
import {useStateStore} from "ui/StateStore.ts";
import {ref} from "vue";
import {storeToRefs} from "pinia";

export function useTextFeatures() {
    const store = useStateStore();
    const {game} = storeToRefs(store);
    const {combinationService} = store.services;
    
    const description = ref<HTMLDivElement>(null);

    const refreshFeatures = (newValue: boolean) => {
        if (!newValue) {
            return;
        }

        // Show the text of added features.
        const features = description.value?.getElementsByTagName('feature');

        if (!features) {
            return;
        }

        const featureArray = Array.prototype.slice.call(features) as HTMLElement[];

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
            e.classList.remove('combine-active-selected');
            e.classList.add('combine-selectable');
        });
    };

    const isFeatureNode = (ev: MouseEvent): boolean => {
        const nodeType = ev.target && (<any>ev.target).nodeName;
        return compareString(nodeType, 'feature');
    }

    const addCombineClass = (ev: MouseEvent, feature: IFeature) => {
        const combineClass = combinationService.getCombineClass(feature);

        if (combineClass) {
            (<any>ev.target).classList.add(combineClass);
        }
    }

    const click = (ev: PointerEvent) => {
        if (isFeatureNode(ev)) {
            const feature = getFeature(ev);

            if (feature) {
                const result = game.value.combinations.tryCombine(feature);
                addCombineClass(ev, feature);

                if (result.success) {
                    refreshFeatures(true);
                }
            }
        }
    }

    const mouseOver = (ev: MouseEvent) => {
        if (isFeatureNode(ev)) {
            const feature = getFeature(ev);
            addCombineClass(ev, feature);
        }
    };

    const getFeature = (ev: MouseEvent): IFeature => {
        const featureName = (<any>ev.target).getAttribute('name');
        return game.value.currentLocation.features.get(featureName);
    }

    return {
        description,
        refreshFeatures,
        click,
        mouseOver,
    }
}