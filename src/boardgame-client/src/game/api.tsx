import axios from 'axios';

const BASE_URL = 'https://localhost:7046';

export const getAllGames = async (playerId?: string) => {
    const response = await axios.get(`${BASE_URL}/api/game/all`, {
        params: { playerId }
    });
    return response.data;
};

export const getGame = async (gameName: string, playerId?: string) => {
    const response = await axios.get(`${BASE_URL}/api/game`, {
        params: { gameName, playerId }
    });
    return response.data;
};

export const joinGame = async (gameName: string, name: string) => {
    const response = await axios.get(`${BASE_URL}/api/game/join`, {
        params: { gameName, name }
    });
    return response.data;
};

export const startGame = async (gameName: string) => {
    const response = await axios.get(`${BASE_URL}/api/game/start`, {
        params: { gameName }
    });
    return response.data;
};

export const checkForTimeout = async (gameName: string) => {
    const response = await axios.get(`${BASE_URL}/api/game/check-for-timeout`, {
        params: { gameName }
    });
    return response.data;
};

export const stopGame = async () => {
    const response = await axios.get(`${BASE_URL}/api/game/stop`);
    return response.data;
};

export const getScores = async () => {
    const response = await axios.get(`${BASE_URL}/api/score/get`);
    return response.data;
};

export const plant = async (gameName: string, playerId: string, fieldId: string) => {
    const response = await axios.get(`${BASE_URL}/api/playing/plant`, {
        params: { gameName, playerId, fieldId }
    });
    return response.data;
};

export const endPlanting = async (gameName: string, playerId: string) => {
    const response = await axios.get(`${BASE_URL}/api/playing/end-planting`, {
        params: { gameName, playerId }
    });
    return response.data;
};

export const endTrading = async (gameName: string, playerId: string) => {
    const response = await axios.get(`${BASE_URL}/api/playing/end-trading`, {
        params: { gameName, playerId }
    });
    return response.data;
};

export const tradePlant = async (gameName: string, playerId: string, cardId: string, fieldId: string) => {
    const response = await axios.get(`${BASE_URL}/api/playing/trade-plant`, {
        params: { gameName, playerId, cardId, fieldId }
    });
    return response.data;
};

export const harvestField = async (gameName: string, playerId: string, fieldId: string) => {
    const response = await axios.get(`${BASE_URL}/api/playing/harvest-field`, {
        params: { gameName, playerId, fieldId }
    });
    return response.data;
};

export const requestTrade = async (gameName: string, playerId: string, offer: any) => {
    const response = await axios.post(`${BASE_URL}/api/playing/request-trade`, offer, {
        params: { gameName, playerId }
    });
    return response.data;
};

export const acceptTrade = async (gameName: string, playerId: string, accept: any) => {
    const response = await axios.post(`${BASE_URL}/api/playing/accept-trade`, accept, {
        params: { gameName, playerId }
    });
    return response.data;
};