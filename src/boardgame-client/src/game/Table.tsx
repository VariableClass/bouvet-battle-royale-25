import {useAtomValue} from "jotai";
import {gameIdAtom} from "../state/store.tsx";
import {startGame} from "./engine.tsx";
import {useState} from "react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "@/components/ui/carousel"

function TableComponent() {
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <Carousel>
                <CarouselContent>
                    <CarouselItem className="md:basis-1/2 lg:basis-1/2"><img src="src/assets/soybean.jpg" /></CarouselItem>
                    <CarouselItem className="md:basis-1/2 lg:basis-1/2"><img src="src/assets/greenbean.jpg" /></CarouselItem>
                </CarouselContent>
            </Carousel>
        </div>
    )
}

export default TableComponent
