import {Ref, ref, watch} from "vue";
import {IFeature} from "storyScript/Interfaces/feature.ts";
import {compareString} from "storyScript/utilityFunctions.ts";
import {useStateStore} from "ui/StateStore.ts";
import {storeToRefs} from "pinia";

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
    const {game} = storeToRefs(store);
    const {rules} = store.services;
    const defaultAction = rules.setup.getCombinationActions().find(c => c.isDefault)?.text?.toLowerCase();
    const defaultImage = rules.setup.getCombinationActions().find(c => c.picture)?.picture?.toLowerCase();
    const defaultImageExtension = defaultImage?.split('.')[1];
    const combinationSymbolDimensions = ref(null);
    
    if (defaultImage) {
        const image = document.createElement('img');
        image.src = `resources/${defaultImage}`;
        image.onload = () => {
            combinationSymbolDimensions.value = { width: image.naturalWidth, height: image.naturalHeight };
        }
    }
    
    const locationFeatures = imageRef;
    const locationImageOriginalWidth = new Map<string, number>();
    const factor = ref(1);
    
    const prepareFeatures = (reset?: boolean) => {
        const loadedImages = [];
        const locationImages = Array.from(locationFeatures.value.querySelectorAll('img'));
        prepareLoadedImages(locationImages, loadedImages);

        const allPromises = loadedImages.map(i => i.loadPromise);
        
        Promise.all(allPromises).then(() => {
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

    const getCombinationAction = () => game.value.combinations.activeCombination?.selectedCombinationAction?.text.toLowerCase() ?? defaultAction;
    
    const setCursor = (e: MouseEvent, regular: boolean) => {
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
    
    watch(() => game.value.combinations.activeCombination, () => {
        const combinationAction = getCombinationAction();
        const areas = Array.from(locationFeatures.value.querySelectorAll('area'));
        const existingSymbols = Array.from(imageRef.value.querySelectorAll('.combination-symbol'));
        existingSymbols.forEach(s => imageRef.value.removeChild(s));
        
        if (!combinationAction) {
            return;
        }

        areas.forEach(a => {
            const coords = a.dataset.imageCoords?.split(',').map(c => parseInt(c));
            
            if (!coords || !coords.length) {
                return;
            }
            
            const image = document.createElement('img');
            image.src = `resources/${combinationAction}.${defaultImageExtension}`;
            const imagePosX = Math.round(coords[0] - combinationSymbolDimensions.value.width / 2);
            const imagePosY = Math.round(coords[1] - combinationSymbolDimensions.value.height / 2);
            
            image.style.position = 'absolute';
            image.style.top = `${imagePosY}px`;
            image.style.left = `${imagePosX}px`;
            image.classList.add('combination-symbol');
            imageRef.value.appendChild(image);
        });
    });
    
    return {
        locationFeatures,
        prepareFeatures,
        getFeatureCoordinates,
        setCursor
    }
}