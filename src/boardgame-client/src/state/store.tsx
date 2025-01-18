import { atom } from 'jotai';

export const nameAtom = atom('NoTradeNancy');
export const playerIdAtom = atom<string>('');
export const gameNameAtom = atom<string>('');
export const playerKeyAtom = atom<string>('a4afe88b-7d8a-4feb-b98f-064a22e30848');
export const gameStateAtom = atom<GameState>();

// Spillrobotens grensesnitt
export interface GameState {
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
    yourHand: Card[];
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
    totalNumberOfType: number;
    exchangeMap: ExchangeMapEntry[];
}

interface ExchangeMapEntry {
    cropSize: number;
    value: number;
}


interface Trade {
    initiatorId: string;
    negotiationId: string;
    offeredCards: string[];
    cardTypesWanted: string[];
}