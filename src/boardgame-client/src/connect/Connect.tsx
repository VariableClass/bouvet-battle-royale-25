import {useState} from 'react'
import './Connect.css'
import {useAtom} from "jotai";
import {gameIdAtom, nameAtom, playerKeyAtom} from "../state/store.tsx";
import {useNavigate} from "react-router-dom";
import { Button } from "@/components/ui/button"

function ConnectPage() {
    interface Game {
        name: string;
        currentPlayer: string;
        currentPhase: string;
        currentState: string;
        round: number;
        phaseTimeLeft: string;
        phaseEndTimestamp: string;
        lastStateChange: string;
        deck: number;
        availableTrades: any[];
        discardPile: any[];
        players: Player[];
        yourHand: any[];
    }

    interface Player {
        name: string,
        coins: number,
        fields: [],
        hand: 0,
        drawnCards: [],
        tradedCards: [],
        isActive: true
    }

    interface ValidationError {
        [key: string]: string[];
    }

    interface ApiError {
        type: string;
        title: string;
        instance: string;
        detail: string;
        status: number;
        errors: ValidationError;
    }

    const [games, setGames] = useState<Game[]>([])
    const [apiError, setApiError] = useState<ApiError>()

    const [name,] = useAtom(nameAtom)
    const [,setGameId] = useAtom(gameIdAtom)
    const [playerKey,] = useAtom(playerKeyAtom)

    const navigate = useNavigate()

    const search = () => {
        return fetch("https://localhost:7046/api/game/all").then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json()
        })
        .then((games: Game[]) => {
            setGames(games);
        }).catch((error: ApiError)=> {
            setApiError(error)
        })
    }

    const connect = (gameName: string) => {
        const params = new URLSearchParams({ gameName, name, playerKey })
        return fetch(`https://localhost:7046/api/game/join?${params}`).then((response) => {
            if (!response.ok) {
                return response.json().then((error: ApiError) => {
                    throw error;
                });
            }
            return response.json()
        })
        .then((gameId) => {
            setGameId(gameId);
            navigate("/game");
        }).catch((error: ApiError) => {
            setApiError(error)
        })
    }

    return (
        <>
            <p>Name: {name}</p>
            <div className="card">
                <Button onClick={() => search()}>
                    Look for games
                </Button>
            </div>
            {
                games.length > 0 &&
                <table>
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Current State</th>
                        <th>Players</th>
                    </tr>
                    </thead>
                    <tbody>
                    {games.map((game, index) => (
                        <tr key={index}>
                            <td>{game.name}</td>
                            <td>{game.currentState}</td>
                            <td>{game.players.map(player => player.name).join('\n')}</td>
                            <td>
                                <Button onClick={() => connect(game.name)}>Join</Button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            }
            {
                apiError &&
                <div onClick={() => setApiError(undefined)} className="errorContainer">
                    <h2>{apiError.title}</h2>
                    {Object.entries(apiError.errors).map(([key, value]) => (
                        <div key={key} className="errorField">
                            {value.map((msg, index) => (
                                <p key={index}>{msg}</p>
                            ))}
                        </div>
                    ))}
                </div>
            }
        </>
    )
}

export default ConnectPage
