import {onUnmounted, ref, useTemplateRef, watch} from "vue";
import {Sprite} from 'storyScript';

export function useSpriteAnimation(settings: Sprite, factor?: number) {
    const sprite = useTemplateRef<HTMLImageElement>('sprite');
    const animationFinished = ref(false);
    factor ??= 1;

    let animation: Animation;
    const animationFrames: Keyframe[] = [];
    const animationSettings: KeyframeAnimationOptions = {};

    watch(() => factor, () => {
        updateSprite();
    });

    onUnmounted(() => {
        cleanupAnimation();
    });

    const cleanupAnimation = () => {
        animation?.cancel();
        animation = null;
    }

    const initSprite = () => {
        animationFrames.push({objectPosition: '0 0'});
        // Todo: add additional steps here to support sprite sheets with multiple rows(?)
        animationFrames.push({objectPosition: '100% 0'});

        animationSettings.duration = (settings.speed ??= 1) * 1000;
        animationSettings.iterations = settings.iterations ?? Infinity;
        animationSettings.easing = `steps(${settings.steps}, jump-none)`;
        updateSprite();
    }

    const updateSprite = () => {
        cleanupAnimation();

        // We need a timeout to make setting up a new animation work in all cases. Without the timeout, the whole 
        // sprite sheet will be displayed without any animation on updates and hot reloads.
        setTimeout(() => {
            updateSpriteAnimation();
        });
    }

    const updateSpriteAnimation = () => {
        if (!sprite.value) {
            return;
        }

        sprite.value.width = Math.round(settings.width * factor);
        sprite.value.height = Math.round(settings.height * factor);
        sprite.value.style.objectFit = 'cover';
        animation = sprite.value.animate(animationFrames, animationSettings);

        if (settings.finishedCallBack) {
            animation.finished.then(() => {
                animationFinished.value = true;
                settings.finishedCallBack();
            });
        }
    }

    return {
        animationFinished,
        initSprite
    }
}