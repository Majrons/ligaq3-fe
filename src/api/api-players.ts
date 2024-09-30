import axiosInstance from './axiosConfig';

// Pobierz graczy dla danej drużyny
export const fetchPlayersByTeam = async (teamId: string) => {
    try {
        const response = await axiosInstance.get(`/players/team/${teamId}`);
        return response.data;
    } catch (error) {
        console.error('Błąd pobierania graczy dla drużyny:', error);
        throw error;
    }
};

// Dodaj nowego gracza
export const addPlayerToTeam = async (teamId: string, playerName: string) => {
    try {
        const response = await axiosInstance.post('/players', { name: playerName, teamId });
        return response.data;
    } catch (error) {
        console.error('Błąd dodawania gracza:', error);
        throw error;
    }
};

// Usuń gracza
export const deletePlayer = async (playerId: string) => {
    try {
        await axiosInstance.delete(`/players/${playerId}`);
    } catch (error) {
        console.error('Błąd usuwania gracza:', error);
        throw error;
    }
};
