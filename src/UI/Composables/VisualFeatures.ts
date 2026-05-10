import {Ref, ref} from "vue";
import {IFeature} from "storyScript/Interfaces/feature.ts";
import {compareString} from "storyScript/utilityFunctions.ts";

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
    const locationFeatures = imageRef;
    const factor = ref(1);
    
    const prepareFeatures = () => {
        const loadedImages = [];
        const locationImages = Array.from(locationFeatures.value.querySelectorAll('img'));
        prepareLoadedImages(locationImages, loadedImages);

        const allPromises = loadedImages.map(i => i.loadPromise);
        
        Promise.all(allPromises).then(() => {
            const mainImage = loadedImages[0].element;

            if (!mainImage.dataset.originalWidth) {
                mainImage.dataset.originalWidth = mainImage.naturalWidth;
            }

            const originalWidth = mainImage.dataset.originalWidth;
            
            factor.value = mainImage.width / originalWidth;
            
            // Resize item images
            loadedImages.slice(1).map(l => l.element).forEach(i => {
                i.width = Math.round(i.naturalWidth * factor.value);
                i.height = Math.round(i.naturalHeight * factor.value);
            });
            
            // Reposition areas
            const areas = Array.from(locationFeatures.value.querySelectorAll('area'));
            
            areas.forEach(a => {
                if (!a.dataset.originalCoords) {
                    a.dataset.originalCoords = a.coords;
                }
                
                const originalCoords = a.dataset.originalCoords;
                a.coords = originalCoords.split(',').map(c => Math.round(parseInt(c) * factor.value)).join(',');
            })
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