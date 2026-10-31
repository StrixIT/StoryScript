import {computed, ref, useTemplateRef, watch} from "vue";
import {Sprite as SpriteClass, useStateStore} from 'storyScript';

export function useDisplayAnimation(participant: any) {
    const participantContainerRef = useTemplateRef<HTMLDivElement>('participant-container');
    const participantImageRef = useTemplateRef<HTMLImageElement>('participant-image');

    const store = useStateStore();
    const {texts} = store.services;

    const healthClass = computed(() => participant.type ? 'enemy-health' : 'character-health');
    const hitPointText = computed(() => participant.type ? texts.enemyHitpoints : texts.characterHitpoints);
    const animationVisible = ref(false);

    watch(() => participant.displayAnimation, newValue => {
        // Use a timeout here to prevent the animation from showing up on the right hand side and moving to its new
        // position when the attack animation is set.
        setTimeout(() => {
            animationVisible.value = !!newValue;
        })
    }, {immediate: true});

    const animationStyle = computed(() => {
        const animation = participant.displayAnimation as SpriteClass;

        if (!participantContainerRef.value || !animation) {
            return {};
        }

        const containerHeight = participantContainerRef.value.clientHeight;
        const containerWidth = participantContainerRef.value.clientWidth;
        let offsetBottom: number;

        if (participantImageRef.value) {
            offsetBottom = participantImageRef.value.clientHeight / 2 - animation.height / 2;
        } else {
            offsetBottom = containerHeight / 2 - animation.height / 2;
        }

        const offsetLeft = containerWidth / 2 - animation.width / 2;

        return {
            position: 'absolute',
            bottom: `${offsetBottom}px`,
            left: `${offsetLeft}px`
        };
    });

    return {
        healthClass,
        hitPointText,
        animationVisible,
        animationStyle
    }
}