import axiosInstance from './axiosConfig';

// Pobierz mecze dla danej drużyny
export const fetchMatchesByTeam = async (teamId: string) => {
    try {
        const response = await axiosInstance.get(`/matches/team/${teamId}`);
        return response.data;
    } catch (error) {
        console.error('Błąd pobierania meczów dla drużyny:', error);
        throw error;
    }
};

// Pobierz wszystkie mecze
export const fetchAllMatches = async () => {
    try {
        const response = await axiosInstance.get('/matches');
        return response.data;
    } catch (error) {
        console.error('Błąd pobierania wszystkich meczów:', error);
        throw error;
    }
};

export const fetchMatch = async (matchId: string) => {
    try {
        const response = await axiosInstance.get(`/matches/${matchId}`);
        return response.data;
    } catch (error) {
        console.error('Błąd pobierania wszystkich meczów:', error);
        throw error;
    }
};

// Dodaj nowy mecz
export const addMatch = async (formData: FormData) => {
    try {
        const response = await fetch('/api/matches', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Błąd podczas dodawania meczu');
        }

        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// Aktualizuj mecz
export const updateMatch = async (matchId: string, formData: FormData) => {
    try {
        const response = await fetch(`/api/matches/${matchId}`, {
            method: 'PUT',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Błąd podczas aktualizacji meczu');
        }

        return await response.json();
    } catch (error) {
        console.error('Błąd aktualizacji meczu:', error);
        throw error;
    }
};

// Usuń mecz
export const deleteMatch = async (matchId: string) => {
    try {
        const response = await axiosInstance.delete(`/matches/${matchId}`);
        return response.data;
    } catch (error) {
        console.error('Błąd usuwania meczu:', error);
        throw error;
    }
};

export const fetchTdmMatches = async () => {
    const response = await axiosInstance.get('/matches/tdm');
    return response.data;
};

export const fetchCtfMatches = async () => {
    const response = await axiosInstance.get('/matches/ctf');
    return response.data;
};
