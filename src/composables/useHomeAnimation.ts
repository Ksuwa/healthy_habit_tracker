import gsap from 'gsap'
import type { Ref } from 'vue'

interface HomeAnimationRefs {
    habitsCard: Ref<HTMLElement | null>
    noteCard: Ref<HTMLElement | null>
    statsGrid: Ref<HTMLElement | null>
    motivationCard: Ref<HTMLElement | null>
    cup: Ref<HTMLElement | null>
    plant: Ref<HTMLElement | null>
}

export function useHomeAnimation({
                                     habitsCard,
                                     noteCard,
                                     statsGrid,
                                     motivationCard,
                                     cup,
                                     plant,
                                 }: HomeAnimationRefs) {

    const play = () => {

        const tl = gsap.timeline({
            defaults: {
                ease: 'power2.out'
            }
        })

        tl
            .from(habitsCard.value, {
                y: -90,
                rotation: -4,
                opacity: 0,
                duration: 1.1,
                ease: 'power3.out',
                transformOrigin: 'top center'
            })

            .from(
                plant.value,
                {
                    y: 30,
                    opacity: 0,
                    duration: .7
                },
                "-=0.9"
            )

            .from(
                noteCard.value,
                {
                    x: 50,
                    opacity: 0,
                    rotation: 2,
                    duration: .7,
                    ease: 'power3.out'
                },
                "-=0.7"
            )

            .from(
                statsGrid.value?.children || [],
                {
                    y: 18,
                    opacity: 0,
                    stagger: .2,
                    duration: .8,
                    ease: 'power2.out'
                },
                "-=0.2"
            )

            .from(
                motivationCard.value,
                {
                    y: 15,
                    opacity: 0,
                    rotation: -1.5,
                    duration: .5
                },
                "-=0.1"
            )

            .from(
                cup.value,
                {
                    scale: .7,
                    rotate: -8,
                    opacity: 0,
                    duration: .5,
                    ease: 'power2.out'
                },
                "-=0.25"
            )
            tl.to(habitsCard.value, {
                keyframes: [
                    { rotation: 0.8, duration: 1.1, ease: 'sine.out' },
                    { rotation: -0.5, duration: 1.5, ease: 'sine.inOut' },
                    { rotation: 0.4, duration: 1.3, ease: 'sine.inOut' },
                    { rotation: -0.2, duration: 1.7, ease: 'sine.inOut' },
                    { rotation: 0, duration: 1.6, ease: 'sine.out' }
                ]
            })
    }

    return {
        play
    }
}