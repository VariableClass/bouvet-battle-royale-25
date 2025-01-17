// Importer nødvendige biblioteker
import axios from 'axios';
import https from 'https';

// Konfigurasjon for API-klienten
const API_BASE_URL = 'https://localhost:7046'; // Endre til riktig URL hvis nødvendig
const gameName = 'GAME1'; // Endre til ønsket spillnavn
const playerId = '3954c9e4-5474-4efd-af8b-d90339805d14'; // Sett riktig spiller-ID
const playerName = 'player1'; // Sett riktig spiller-navn



const axiosClient = axios.create({
    baseURL: API_BASE_URL,
    httpsAgent: new https.Agent({
      rejectUnauthorized: false,
    }),
  });


// Spillrobotens grensesnitt
interface GameState {
    name: string;
    currentPlayer: string;
    currentPhase: string;
    currentState: string;
    round: number;
    phaseTimeLeft: string;
    phaseEndTimestamp: string;
    lastStateChange: string;
    deck: number;
    availableTrades: Trade[];
    discardPile: any[];
    players: Player[];
    yourHand: HandCard[];
}

interface Player {
    name: string;
    coins: number;
    fields: Field[];
    hand: number;
    drawnCards: Card[];
    tradedCards: Card[];
    isActive: boolean;
}

interface Field {
    key: string;
    card: Card[];
}

interface Card {
    id: string;
    type: string;
    exchangeMap: ExchangeMapEntry[];
}

interface ExchangeMapEntry {
    cropSize: number;
    value: number;
}

interface HandCard {
    id: string;
    type: string;
    exchangeMap: ExchangeMapEntry[];
    firstCard: boolean;
}

interface Trade {
    initiatorId: string;
    negotiationId: string;
    offeredCards: string[];
    cardTypesWanted: string[];
}

// Hent spillstatus
async function fetchGameState(gameName: string): Promise<GameState> {
    const response = await axiosClient.get(`api/game`, {
        params: { gameName },
    });
    return response.data;
}

// Utfør handlinger basert på spilltilstanden
async function takeTurn(gameState: GameState, playerId: string, playerName: string): Promise<void> {
    
    if (gameState.currentPhase === 'Planting') {
        console.log(`Spiller ${playerName} kan plante bønner.`);
        await handlePlanting(gameState, playerId);
        gameState = await fetchGameState(gameName);
    }

    if (gameState.currentPhase === 'Trading') {
        console.log(`Spiller ${playerName} kan handle.`);
        await handleTrading(gameState, playerId);
    }  

    if (gameState.currentPhase === 'Harvesting') {
        console.log(`Spiller ${playerName} kan høste bønner.`);
        await handleHarvesting(gameState, playerId);
    } else {
        console.log(`Fase ${gameState.currentPhase} støttes ikke ennå.`);
    }
   
}

// Håndter trading
async function handleTrading(gameState: GameState, playerId: string): Promise<void> {
    for (const trade of gameState.availableTrades) {
        if (trade.cardTypesWanted.includes(gameState.yourHand[0]?.type)) {
            console.log(`Godtar handel for korttype ${gameState.yourHand[0]?.type}.`);
            await acceptTrade(gameState.name, playerId, trade.negotiationId);
            return;
        }
    }
    console.log('Ingen relevante handler tilgjengelige.');
}

// Håndter planting
async function handlePlanting(gameState: GameState, playerId: string): Promise<void> {
    for (const card of gameState.yourHand) {
        const targetField = gameState.players
            .find(p => p.name === playerId)
            ?.fields.find(field => field.card[0]?.type === card.type || field.card.length === 0);

        if (targetField) {
            await plantCard(gameState.name, playerId, targetField.key);
            return;
        }
    }
    console.log('Ingen mulighet for planting.');
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
async function startBot(gameName: string, playerId: string, playerName: string): Promise<void> {

    try {
        let gameState = await fetchGameState(gameName);
        // console.log('Spillstatus hentet:', gameState);

        while (gameState.currentState !== 'Playing') {
            console.log('Spillet er ikke i gang.');
            await new Promise(resolve => setTimeout(resolve, 5000));
            gameState = await fetchGameState(gameName);
        }

        while(gameState.currentState === 'Playing')
        {
            if(gameState.currentPlayer !== playerName)
            {
                console.log('Det er ikke din tur ennå.');
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
            else
            {
                // Ta en tur basert på spillstatus
                await takeTurn(gameState, playerId, playerName);
            }
           
            gameState = await fetchGameState(gameName);
        }

        console.log('Spillstatus hentet:', gameState.currentState);

    } catch (error) {
        console.error('Feil under henting av spillstatus:', error);
    }
}

// Start roboten
startBot(gameName, playerId, playerName);
