import {useState} from 'react'
import './Connect.css'
import {useAtom} from "jotai";
import {playerIdAtom, GameState, nameAtom, playerKeyAtom, gameNameAtom} from "../state/store.tsx";
import {useNavigate} from "react-router-dom";
import { Button } from "@/components/ui/button"

function ConnectPage() {
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

    const [games, setGames] = useState<GameState[]>([])
    const [apiError, setApiError] = useState<ApiError>()

    const [name,] = useAtom(nameAtom)
    const [,setPlayerId] = useAtom(playerIdAtom)
    const [,setGameName] = useAtom(gameNameAtom)
    const [playerKey,] = useAtom(playerKeyAtom)

    const navigate = useNavigate()

    const search = () => {
        return fetch("https://bbr25-backend-bpacbhhzbdcsdfez.canadacentral-01.azurewebsites.net/api/game/all").then((response) => {
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
        return fetch(`https://bbr25-backend-bpacbhhzbdcsdfez.canadacentral-01.azurewebsites.net/api/game/join?${params}`).then((response) => {
            if (!response.ok) {
                return response.json().then((error: ApiError) => {
                    throw error;
                });
            }
            return response.json()
        })
        .then((gameId) => {
            setGameName(gameName);
            setPlayerId(gameId);
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
