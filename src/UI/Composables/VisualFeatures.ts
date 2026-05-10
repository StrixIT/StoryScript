import {Ref, ref} from "vue";
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
                
                const avgX =  totalX / (calculatedCoords.length / 2);
                const avgY =  totalY / (calculatedCoords.length / 2);

                a.dataset.imageCoords = `${avgX}x${avgY}`;
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
    
    return {
        locationFeatures,
        prepareFeatures,
        getFeatureCoordinates
    }
}