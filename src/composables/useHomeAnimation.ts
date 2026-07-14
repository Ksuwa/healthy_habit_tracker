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
                y: -120,
                rotation: -6,
                opacity: 0,
                duration: 1.2,
                ease: 'elastic.out(1, 0.65)'
            })

            .from(
                plant.value,
                {
                    y: 40,
                    opacity: 0,
                    duration: .6
                },
                "-=1"
            )

            .from(
                noteCard.value,
                {
                    x: 60,
                    opacity: 0,
                    rotation: 3,
                    duration: .6
                },
                "-=0.8"
            )

            .from(
                statsGrid.value?.children || [],
                {
                    y: 25,
                    opacity: 0,
                    stagger: .15,
                    duration: .5,
                    ease: 'back.out(1.8)'
                },
                "-=0.2"
            )

            .from(
                motivationCard.value,
                {
                    y: 20,
                    opacity: 0,
                    rotation: -2,
                    duration: .4
                }
            )

            .from(
                cup.value,
                {
                    scale: .6,
                    rotate: -12,
                    opacity: 0,
                    duration: .5,
                    ease: 'back.out(2)'
                },
                "-=0.2"
            )
          tl.to(habitsCard.value, {
            rotation: 1,
            duration: .15
          })
              .to(habitsCard.value, {
                rotation: 0,
                duration: .25,
                ease: "power2.out"
              })
    }

    return {
        play
    }
}