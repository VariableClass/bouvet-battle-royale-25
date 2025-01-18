import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger
  } from "@/components/ui/drawer"
import {
    Carousel,
    CarouselContent,
    CarouselItem
  } from "@/components/ui/carousel"
import {gameStateAtom} from "../state/store.tsx";
import {useAtomValue} from "jotai";

function HandComponent() {
    const hand = useAtomValue(gameStateAtom).yourHand;

    return (
        <Drawer>
            <DrawerTrigger>Open</DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                        <DrawerTitle>Your Hand</DrawerTitle>
                </DrawerHeader>
                <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                    <Carousel>
                        <CarouselContent>
                            <CarouselItem className="md:basis-1/5 lg:basis-1/5"><img src="src/assets/soybean.jpg" /></CarouselItem>
                            <CarouselItem className="md:basis-1/5 lg:basis-1/5"><img src="src/assets/greenbean.jpg" /></CarouselItem>
                            <CarouselItem className="md:basis-1/5 lg:basis-1/5"><img src="src/assets/stinkbean.jpg" /></CarouselItem>
                            <CarouselItem className="md:basis-1/5 lg:basis-1/5"><img src="src/assets/mokabean.jpg" /></CarouselItem>
                            <CarouselItem className="md:basis-1/5 lg:basis-1/5"><img src="src/assets/coffeebean.jpg" /></CarouselItem>
                        </CarouselContent>
                    </Carousel>
                </div>
            </DrawerContent>
        </Drawer>
    )
}

export default HandComponent
