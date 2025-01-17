import {useAtom} from "jotai";
import {gameIdAtom} from "../state/store.tsx";

function GamePage() {
    const [gameId,] = useAtom(gameIdAtom)
    return (
        <>
            <h3>Game Id: {gameId}</h3>
        </>
    )
}

export default GamePage
