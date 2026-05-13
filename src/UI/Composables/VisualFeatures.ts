import {Ref, ref, watch} from "vue";
import {IFeature} from "storyScript/Interfaces/feature.ts";
import {compareString} from "storyScript/utilityFunctions.ts";
import {useStateStore} from "ui/StateStore.ts";
import {storeToRefs} from "pinia";
import {isTouchDevice} from "../../../constants.ts";
import {gameEvents} from "storyScript/gameEvents.ts";
import {GameEventNames} from "storyScript/gameEventNames.ts";

const prepareLoadedImages = (locationImages: HTMLImageElement[], loadedImages: any[])=> {
    locationImages.forEach(l => {
        let promiseResolve: () => {};

        const loadPromise = new Promise((r: any) => {
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
}

export function useVisualFeatures(imageRef: Ref<HTMLDivElement>){
    const store = useStateStore();
    const {game, defaultCombination, defaultCombinationImageExtension, combinationSymbolDimensions} = storeToRefs(store);

    const locationFeatures = imageRef;
    const locationImageOriginalWidth = new Map<string, number>();
    const factor = ref(1);

    gameEvents.subscribe(GameEventNames.Reset, () => prepareFeatures(false, true));
    gameEvents.subscribe(GameEventNames.Restart, () => prepareFeatures(false, true));
    
    const prepareFeatures = (recalculate: boolean, reset: boolean) => {
        const loadedImages = [];
        const locationImages = Array.from(locationFeatures.value.querySelectorAll('img'));
        prepareLoadedImages(locationImages, loadedImages);

        const allPromises = loadedImages.map(i => i.loadPromise);
        
        Promise.all(allPromises).then(() => {
            if (recalculate) {
                const mainImage = loadedImages[0].element;

                if (reset || !mainImage.dataset.originalWidth) {
                    let naturalWidth = mainImage.naturalWidth;

                    if (!naturalWidth) {
                        naturalWidth = locationImageOriginalWidth[game.value.currentLocation.id];
                    } else {
                        locationImageOriginalWidth[game.value.currentLocation.id] = naturalWidth;
                    }

                    mainImage.dataset.originalWidth = naturalWidth;
                }

                factor.value = mainImage.width / parseInt(mainImage.dataset.originalWidth);
            }
            
            // Resize item images
            loadedImages.slice(1).map(l => l.element).forEach(i => {
                i.width = Math.round(i.naturalWidth * factor.value);
                i.height = Math.round(i.naturalHeight * factor.value);
            });
            
            // Reposition areas and add symbols for active combination.
            const areas = Array.from(locationFeatures.value.querySelectorAll('area'));
            
            areas.forEach(a => {
                if (reset || !a.dataset.originalCoords) {
                    a.dataset.originalCoords = a.coords;
                }
                
                const originalCoords = a.dataset.originalCoords;
                const calculatedCoords = originalCoords.split(',').map(c => Math.round(parseInt(c.trim()) * factor.value));
                a.coords = calculatedCoords.join(',');
                
                let totalX = 0, totalY = 0;

                calculatedCoords.forEach((c, i) => {
                    (i + 1) % 2 !== 0 ? totalX += c : totalY += c;
                })
                
                const avgX =  Math.round(totalX / (calculatedCoords.length / 2));
                const avgY =  Math.round(totalY / (calculatedCoords.length / 2));
                a.dataset.imageCoords = `${avgX},${avgY}`;
            });
        });
    }
    
    const getFeatureCoordinates = (feature: IFeature): { top: string, left: string } => {
        const coords = feature.coords.split(',');
        let top: number, left: number;

        if (compareString(feature.shape, 'poly')) {
            const x: number[] = [], y: number[] = [];

            for (let i = 0; i < coords.length; i++) {
                const value = coords[i];
                if (i % 2 === 0) {
                    x.push(parseInt(value));
                } else {
                    y.push(parseInt(value));
                }
            }

            left = Math.round(x.reduce(function (p, v) {
                return (p < v ? p : v);
            }) * factor.value);

            top = Math.round(y.reduce(function (p, v) {
                return (p < v ? p : v);
            }) * factor.value);
        } else {
            left = Math.round(parseInt(coords[0]) * factor.value);
            top = Math.round(parseInt(coords[1]) * factor.value);
        }

        return {
            top: `${top}px`,
            left: `${left}px`
        };
    }

    const getCombinationAction = () => game.value.combinations.activeCombination?.selectedCombinationAction?.text.toLowerCase() ?? defaultCombination.value;
    
    const setCursor = (e: MouseEvent, regular: boolean) => {
        if (isTouchDevice){
            return;
        }
        
        const combinationAction = getCombinationAction();

        if (!combinationAction) {
            return;
        }

        const element = e.target as HTMLAreaElement;

        if (regular) {
            element.classList.remove(combinationAction);
        } else {
            element.classList.add(combinationAction);
        }
    }
    
    const setCombinationSymbols = () => {
        if (!isTouchDevice){
            return;
        }
        
        const combinationAction = getCombinationAction();
        const areas = Array.from(locationFeatures.value?.querySelectorAll('area'));
        const existingSymbols = Array.from(imageRef.value?.querySelectorAll('.combination-symbol'));
        
        existingSymbols?.forEach(s => {
            const symbolImage = s as HTMLImageElement;
            symbolImage.onclick = null;
            imageRef.value.removeChild(symbolImage);
        });

        if (!combinationAction) {
            return;
        }

        areas?.forEach(a => {
            const coords = a.dataset.imageCoords?.split(',').map(c => parseInt(c));

            if (!coords || !coords.length) {
                return;
            }

            const featureId = a.id.replace('feature-area-', '');
            const feature = game.value.currentLocation.features.get(featureId);
            
            if (!feature) {
                return;
            }
            
            const image = document.createElement('img');
            image.src = `resources/${combinationAction}.${defaultCombinationImageExtension.value}`;
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

    // watch(() => game.value.currentLocation, () => {
    //     prepareFeatures(false, true);
    // });
    
    window.onresize = () => {
        prepareFeatures(true, false);
        
        // We need a timeout here to allow the DOM to update so we can get the updated coordinates for
        // the symbols from the area data attributes.
        setTimeout(() => {
            setCombinationSymbols();
        });
    };
    
    watch(() => game.value.combinations.activeCombination, () => setCombinationSymbols());
    
    return {
        locationFeatures,
        prepareFeatures,
        getFeatureCoordinates,
        setCursor
    }
}