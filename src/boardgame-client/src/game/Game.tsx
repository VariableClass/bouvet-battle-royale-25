import {useAtomValue} from "jotai";
import {gameIdAtom} from "../state/store.tsx";
import {startGame} from "./engine.tsx";
import { Button } from "@/components/ui/button"
import {useState} from "react";

function GamePage() {
    const [running, setRunning] = useState<boolean>(false)
    const gameId = useAtomValue(gameIdAtom)
    return (
        <>
            <h3>Game Id: {gameId}</h3>
            { !running && (<Button onClick={() => {
                setRunning(true)
                startGame()
            }}>Start game</Button>) }
        </>
    )
}

export default GamePage
