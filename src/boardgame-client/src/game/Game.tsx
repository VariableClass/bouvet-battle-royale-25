import {useAtom, useAtomValue} from "jotai";
import {gameNameAtom, GameState, gameStateAtom, nameAtom, playerIdAtom} from "../state/store.tsx";
import { Button } from "@/components/ui/button"
import {useState} from "react";
import axios from "axios";
import Hand from "./Hand.tsx";

function GamePage() {
    const [running, setRunning] = useState<boolean>(false)

    const gameName= useAtomValue(gameNameAtom)
    const playerId = useAtomValue(playerIdAtom)
    const playerName = useAtomValue(nameAtom)
    const [gameState, updateGameState] = useAtom(gameStateAtom);

    const API_BASE_URL = 'https://bbr25-backend-bpacbhhzbdcsdfez.canadacentral-01.azurewebsites.net'; // Endre til riktig URL hvis nødvendig

    const axiosClient = axios.create({
        baseURL: API_BASE_URL
    });

    axiosClient.interceptors.response.use(
        async response => {
            await new Promise(resolve => setTimeout(resolve, 500)); // 1-second delay
            return response;
        },
        error => {
            return Promise.reject(error);
        }
    );

// Hent spillstatus
    async function fetchGameState(gameName: string, playerId: string): Promise<GameState> {
        const response = await axiosClient.get(`api/game`, {
            params: { gameName, playerId },
        });
        return response.data;
    }

// Utfør handlinger basert på spilltilstanden
    async function takeTurn(gameState: GameState, playerId: string, playerName: string): Promise<void> {

        if (gameState.currentPhase === 'Planting') {
            console.log(`Spiller ${playerName} kan plante bønner.`);
            await handlePlantingFirstCard(gameState, playerId, playerName);
        }
        else if (gameState.currentPhase === 'PlantingOptional') {
            console.log(`Spiller ${playerName} kan plante bønner.`);
            await handlePlantingOptional(gameState, playerId, playerName);
        }
        else if (gameState.currentPhase === 'Trading') {
            console.log(`Spiller ${playerName} kan trade.`);
            await handleTrading(gameState, playerId, playerName);
        }
        else if (gameState.currentPhase === 'TradePlanting') {
            console.log(`Spiller ${playerName} kan plante etter trading.`);
            await handleTradePlanting(gameState, playerId, playerName);
            await plantDrawnCards(gameState, playerId, playerName);
        } else {
            console.log(`Fase ${gameState.currentPhase} støttes ikke ennå.`);
        }
    }

// Håndter trading
    async function handleTrading(gameState: GameState, playerId: string, playerName: string): Promise<void> {
        // for (const trade of gameState.availableTrades) {
        //     if (trade.cardTypesWanted.includes(gameState.yourHand[0]?.type)) {
        //         console.log(`Godtar handel for korttype ${gameState.yourHand[0]?.type}.`);
        //         await acceptTrade(gameState.name, playerId, trade.negotiationId);
        //         return;
        //     }
        // }
        // console.log('Ingen relevante handler tilgjengelige.');
        await endTrading(gameState.name, playerId);
    }

// Håndter planting
    async function handlePlantingFirstCard(gameState: GameState, playerId: string, playerName: string): Promise<void> {

        if(gameState.yourHand.length === 0)
            return;

        await handlePlantCard(gameState, playerId, playerName, gameState.yourHand[0], false);
    }

    function getFieldValue(field: Field): number {

        if (field.card.length === 0) {
            return 0;
        }

        const cropSize = field.card.length;
        const cardValue = field.card[0].exchangeMap.reduce((max, entry) => { max = entry.cropSize <= cropSize ? entry.value : max; return max; }, 0);
        return cardValue;
    }

    async function handlePlantingOptional(gameState: GameState, playerId: string, playerName: string): Promise<void> {
        // for (const card of gameState.yourHand) {
        //     if (!card.firstCard) {
        //         continue;
        //     }

        //     const targetField = gameState.players
        //         .find(p => p.name === playerName)
        //         ?.fields.find(field => field.card[0]?.type === card.type || field.card.length === 0);

        //     if (targetField) {
        //         await plantCard(gameState.name, playerId, targetField.key);
        //         return;
        //     }
        // }
        // console.log('Ingen mulighet for planting.');
        console.log('Ikke implementert PlantingOptional');

        await endPlanting(gameState.name, playerId);

    }

    async function handleTradePlanting(gameState: GameState, playerId: string, playerName: string): Promise<void> {
        // for (const card of gameState.yourHand) {
        //     if (!card.firstCard) {
        //         continue;
        //     }

        //     const targetField = gameState.players
        //         .find(p => p.name === playerName)
        //         ?.fields.find(field => field.card[0]?.type === card.type || field.card.length === 0);

        //     if (targetField) {
        //         await plantCard(gameState.name, playerId, targetField.key);
        //         return;
        //     }
        // }
        // console.log('Ingen mulighet for planting.');
        console.log('Ikke implementert TradePlanting');
    }

    async function handlePlantCard(gameState: GameState, playerId: string, playerName: string, card: Card, isTradePlanting: boolean = false): Promise<void> {
        const targetField = gameState.players
            .find(p => p.name === playerName)
            ?.fields.find(field => field.card[0]?.type === card.type || field.card.length === 0);

        if (targetField) {
            if (isTradePlanting) {
                await tradePlantCard(gameState.name, playerId, targetField.key, card.id);
            }
            else {
                await plantCard(gameState.name, playerId, targetField.key);
            }
            return;
        }

        const fields = gameState.players.find(p => p.name === playerName)?.fields;

        if (!fields) {
            console.log('Fant ingen felt.');
            return;
        }

        //Harvest field with largest value

        let valueField0 = getFieldValue(fields[0]);
        let valueField1 = getFieldValue(fields[1]);

        if (fields[0].card.length == 1 && fields[1].card.length > 1) {
            await harvestField(gameState.name, playerId, fields[1].key);
            if(isTradePlanting) { await tradePlantCard(gameState.name, playerId, fields[1].key, card.id); }
            else { await plantCard(gameState.name, playerId, fields[1].key); }
            return;
        }
        if (fields[1].card.length == 1 && fields[0].card.length > 1) {
            await harvestField(gameState.name, playerId, fields[0].key);
            if(isTradePlanting) { await tradePlantCard(gameState.name, playerId, fields[0].key, card.id); }
            else { await plantCard(gameState.name, playerId, fields[0].key); }
            return;
        }

        if(valueField0 === valueField1)
        {
            if(fields[0].card[0].totalNumberOfType > fields[1].card[0].totalNumberOfType)
            {
                valueField0 += 1;
            }
            else {
                valueField1 += 1;
            }
        }

        if (valueField0 > valueField1) {
            await harvestField(gameState.name, playerId, fields[0].key);

            if(isTradePlanting) { await tradePlantCard(gameState.name, playerId, fields[0].key, card.id); }
            else { await plantCard(gameState.name, playerId, fields[0].key); }
        }
        else if (valueField0 < valueField1) {
            await harvestField(gameState.name, playerId, fields[1].key);
            if(isTradePlanting) { await tradePlantCard(gameState.name, playerId, fields[1].key, card.id); }
            else { await plantCard(gameState.name, playerId, fields[1].key); }
        }
    }

    async function plantDrawnCards(gameState: GameState, playerId: string, playerName: string) {
        for (const card of gameState.players.find(p => p.name === playerName)?.drawnCards || []) {
            const state = await fetchGameState(gameName, playerId);
            await handlePlantCard(state, playerId, playerName, card, true);
        }
    }



// Håndter høsting
    async function handleHarvesting(gameState: GameState, playerId: string): Promise<void> {
        const playerFields = gameState.players.find(p => p.name === playerId)?.fields || [];
        for (const field of playerFields) {
            if (field.card.length > 0) {
                const cropSize = field.card.length;
                const valueMap = field.card[0].exchangeMap.find(entry => entry.cropSize <= cropSize);
                if (valueMap) {
                    console.log(`Høster felt ${field.key} for ${valueMap.value} mynter.`);
                    await harvestField(gameState.name, playerId, field.key);
                    return;
                }
            }
        }
        console.log('Ingen felt kan høstes.');
    }

// API-kall for å plante et kort
    async function plantCard(gameName: string, playerId: string, fieldId: string): Promise<void> {
        try {
            const response = await axiosClient.get(`api/playing/plant`, {
                params: {
                    gameName,
                    playerId,
                    fieldId,
                },
            });
            console.log(`Kort plantet i spill ${gameName}, felt ${fieldId}.`);
        } catch (error) {
            console.error('Feil under planting:', error);
        }
    }

    async function tradePlantCard(gameName: string, playerId: string, fieldId: string, cardId: string): Promise<void> {
        try {
            const response = await axiosClient.get(`api/playing/trade-plant`, {
                params: {
                    gameName,
                    playerId,
                    fieldId,
                    cardId
                },
            });
            console.log(`Kort trade-plantet i spill ${gameName}, felt ${fieldId}.`);
        } catch (error) {
            console.error('Feil under trade-planting:', error);
        }
    }

// API-kall for å høste et felt
    async function harvestField(gameName: string, playerId: string, fieldId: string): Promise<void> {
        try {
            const response = await axiosClient.get(`api/playing/harvest-field`, {
                params: {
                    gameName,
                    playerId,
                    fieldId,
                },
            });
            console.log(`Felt ${fieldId} høstet i spill ${gameName}.`);
        } catch (error) {
            console.error('Feil under høsting:', error);
        }
    }

    async function endPlanting(gameName: string, playerId: string): Promise<void> {
        try {
            const response = await axiosClient.get(`api/playing/end-planting`, {
                params: {
                    gameName,
                    playerId
                },
            });
            console.log(`Avsluttet planting.`);
        } catch (error) {
            console.error('Feil under avslutte planting:', error);
        }
    }

    async function endTrading(gameName: string, playerId: string): Promise<void> {
        try {
            const response = await axiosClient.get(`api/playing/end-trading`, {
                params: {
                    gameName,
                    playerId
                },
            });
            console.log(`Avsluttet trading.`);
        } catch (error) {
            console.error('Feil under avslutte trading:', error);
        }
    }


// API-kall for å godta en handel
    async function acceptTrade(gameName: string, playerId: string, negotiationId: string): Promise<void> {
        try {
            const response = await axiosClient.post(`api/playing/accept-trade`, null, {
                params: {
                    gameName,
                    playerId,
                },
                data: {
                    negotiationId,
                    payment: [], // Tilpass betaling om nødvendig
                },
            });
            console.log(`Handel ${negotiationId} akseptert i spill ${gameName}.`);
        } catch (error) {
            console.error('Feil under handel:', error);
        }
    }

// Start spillroboten
    async function startBot(): Promise<void> {

        try {
            let state = await fetchGameState(gameName, playerId);
            updateGameState(state)
            // console.log('Spillstatus hentet:', gameState);

            while (state.currentState !== 'Playing') {
                console.log('Spillet er ikke i gang.')
                await new Promise(resolve => setTimeout(resolve, 5000))
                state = await fetchGameState(gameName, playerId)
                updateGameState(state)
            }

            while(state.currentState === 'Playing')
            {
                if(state.currentPlayer !== playerName)
                {
                    console.log('Det er ikke din tur ennå.');
                    await new Promise(resolve => setTimeout(resolve, 2000));
                }
                else
                {
                    // Ta en tur basert på spillstatus
                    await takeTurn(state, playerId, playerName);
                }

                state = await fetchGameState(gameName, playerId);
                updateGameState(state);
            }

            console.log('Spillstatus hentet:', state.currentState);

        } catch (error) {
            console.error('Feil under henting av spillstatus:', error);
        }
    }

    return (
        <>
            <h3>Game Id: {playerId}</h3>
            { !running && (<Button onClick={() => {
                setRunning(true)
                startBot()
            }}>Start game</Button>) }
            { running && gameState && (<Hand/>)}
        </>
    )
}

export default GamePage
