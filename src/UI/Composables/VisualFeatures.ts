import {computed, onUpdated, Ref, ref, watch} from "vue";
import {IFeature} from "storyScript/Interfaces/feature.ts";
import {compareString} from "storyScript/utilityFunctions.ts";
import {useStateStore} from "ui/StateStore.ts";
import {storeToRefs} from "pinia";
import {isTouchDevice} from "../../../constants.ts";

const prepareLoadedImages = (locationImages: HTMLImageElement[]) => {
    const loadedImages: { element: HTMLImageElement, loadPromise: Promise<void> }[] = [];

    locationImages.forEach(l => {
        let promiseResolve: () => {};

        const loadPromise = new Promise<void>((r: any): void => {
            promiseResolve = r;
        });

        l.onload = promiseResolve;

        if (l.naturalWidth > 0) {
            promiseResolve();
        }

        loadedImages.push({
            element: l,
            loadPromise: loadPromise
        });
    });

    return loadedImages;
}

export function useVisualFeatures(imageRef: Ref<HTMLDivElement>) {
    const store = useStateStore();
    const {
        game,
        defaultCombination,
        defaultCombinationImageExtension,
        combinationSymbolDimensions,
        defaultPointerStyle
    } = storeToRefs(store);

    const locationFeatures = imageRef;
    const locationImageOriginalWidth = new Map<string, number>();
    const featureImageOriginalDimensions = new Map<string, [number, number]>();
    const areaOriginalCoordinates = new Map<string, string>();
    const factor = ref(1);
    const locationId = computed(() => game.value.currentLocation.id);

    const actionName = computed(() => game.value.combinations.activeCombination?.selectedCombinationAction?.text.toLowerCase() ?? defaultCombination.value);

    const calculateFactor = () => {
        if (!locationFeatures.value) {
            return;
        }
        
        const mainImage = locationFeatures.value.querySelector('img');
        factor.value = mainImage.width / locationImageOriginalWidth.get(game.value.currentLocation.id);
    }

    window.onresize = () => {
        calculateFactor();
        prepareFeatures();
    };

    onUpdated(() => {
        prepareFeatures();
    });

    watch(() => game.value.combinations.activeCombination, () => setCombinationSymbols());

    const initFeatures = () => {
        const mainImage = locationFeatures.value?.querySelector('img');

        if (!locationImageOriginalWidth.has(locationId.value)) {
            locationImageOriginalWidth.set(locationId.value, mainImage.naturalWidth);
        }

        calculateFactor();
        prepareFeatures();
    }

    const prepareFeatures = () => {
        if (!locationFeatures.value) {
            return;
        }
        
        const locationImages = Array.from(locationFeatures.value.querySelectorAll('img.feature-picture') ?? []) as HTMLImageElement[];
        const loadedImages = prepareLoadedImages(locationImages);
        const allPromises = loadedImages.map(i => i.loadPromise);

        Promise.all(allPromises).then(() => {
            // Resize item images
            loadedImages.map(l => l.element).forEach(i => {
                const featureId = i.id.split('-')[1];
                const imageKey = `${locationId.value}-${featureId}`;

                if (!featureImageOriginalDimensions.has(imageKey)) {
                    featureImageOriginalDimensions.set(imageKey, [i.naturalWidth, i.naturalHeight]);
                }

                const originalDimensions = featureImageOriginalDimensions.get(imageKey);
                i.width = Math.round(originalDimensions[0] * factor.value);
                i.height = Math.round(originalDimensions[1] * factor.value);
            });

            // Reposition areas and images for features and add symbols for active combination.
            const areas = Array.from(locationFeatures.value.querySelectorAll('area'));

            areas.forEach(a => {
                const featureId = a.id.split('-')[2];
                const areaKey = `${locationId.value}-${featureId}`;

                if (!areaOriginalCoordinates.has(areaKey)) {
                    areaOriginalCoordinates.set(areaKey, a.coords);
                }

                const originalCoords = areaOriginalCoordinates.get(areaKey);
                const calculatedCoords = originalCoords.split(',').map(c => Math.round(parseInt(c.trim()) * factor.value));
                a.coords = calculatedCoords.join(',');

                // Calculate the center of the area to place a symbol later on.
                let totalX = 0, totalY = 0;

                calculatedCoords.forEach((c, i) => {
                    (i + 1) % 2 !== 0 ? totalX += c : totalY += c;
                })

                const avgX = Math.round(totalX / (calculatedCoords.length / 2));
                const avgY = Math.round(totalY / (calculatedCoords.length / 2));
                a.dataset.imageCoords = `${avgX},${avgY}`;
                positionFeatureImage(featureId, avgX, avgY);
            });

            // We need a timeout here to allow the DOM to update so we can get the updated coordinates for
            // the symbols from the area data attributes.
            setTimeout(() => {
                setCombinationSymbols();
            });
        });
    }

    const positionFeatureImage = (featureId: string, x: number, y: number) => {
        if (!game.value.currentLocation.features.get(featureId)?.picture) {
            return;
        }
        
        const featureImage = Array.from(locationFeatures.value.querySelectorAll('img.feature-picture'))
            .find(a => a.id.split('-')[1] === featureId) as HTMLImageElement;
        
        if (!featureImage) {
            return;
        }
        
        const top = y - featureImage.height / 2;
        const left = x - featureImage.width / 2;
        featureImage.style.top = top + 'px';
        featureImage.style.left = left + 'px';
    }

    const setCombinationSymbols = () => {
        if (!isTouchDevice) {
            return;
        }

        const areas = Array.from(locationFeatures.value?.querySelectorAll('area'));
        const existingSymbols = Array.from(imageRef.value?.querySelectorAll('.combination-symbol'));

        existingSymbols?.forEach(s => {
            const symbolImage = s as HTMLImageElement;
            symbolImage.onclick = null;
            imageRef.value.removeChild(symbolImage);
        });

        if (!actionName.value) {
            return;
        }

        areas?.forEach(a => {
            const coords = a.dataset.imageCoords?.split(',').map(c => parseInt(c));

            if (!coords || !coords.length) {
                return;
            }

            const featureId = a.id.split('-')[2];
            const feature = game.value.currentLocation.features.get(featureId);

            if (!feature) {
                return;
            }

            const image = document.createElement('img');
            image.src = `resources/${actionName.value}.${defaultCombinationImageExtension.value}`;
            const imageWidth = Math.round(combinationSymbolDimensions.value.width * factor.value);
            const imageHeight = Math.round(combinationSymbolDimensions.value.height * factor.value);
            const imagePosX = Math.round(coords[0] - imageWidth / 2);
            const imagePosY = Math.round(coords[1] - imageHeight / 2);

            image.style.position = 'absolute';
            image.style.width = imageWidth + 'px';
            image.style.height = imageHeight + 'px';
            image.style.top = `${imagePosY}px`;
            image.style.left = `${imagePosX}px`;
            image.classList.add('combination-symbol');
            image.onclick = () => game.value.combinations.tryCombine(feature);
            imageRef.value.appendChild(image);
        });
    }

    const setCursor = (e: MouseEvent, regular: boolean) => {
        if (isTouchDevice) {
            return;
        }

        if (!actionName.value) {
            return;
        }

        const element = e.target as HTMLAreaElement;
        setCursorStyle(element, regular);
    }

    const setCursorStyle = (element: HTMLElement, regular: boolean) => {
        let cursorStyle = '';

        if (!regular) {
            cursorStyle = defaultPointerStyle.value.replace('resources/default.png', `resources/${actionName.value}.${defaultCombinationImageExtension.value}`);
        }

        element.style.cursor = cursorStyle;
    }

    const tryCombine = (eventOrElement: PointerEvent | HTMLElement, feature: IFeature) => {
        game.value.combinations.tryCombine(feature);
        const element = (eventOrElement as PointerEvent).target as HTMLElement ?? eventOrElement as HTMLElement;
        setCursorStyle(element, true);
    }

    return {
        locationFeatures,
        initFeatures,
        prepareFeatures,
        setCursor,
        tryCombine
    }
}