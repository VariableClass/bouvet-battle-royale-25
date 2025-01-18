import {useAtomValue} from "jotai";
import {gameIdAtom} from "../state/store.tsx";
import {startGame} from "./engine.tsx";
import {useState} from "react";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
  } from "@/components/ui/drawer"
import {
    Button,
    } from "@/components/ui/button"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "@/components/ui/carousel"

function HandComponent() {
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
