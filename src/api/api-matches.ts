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
export const addMatch = async (
    homeTeam: string,
    awayTeam: string,
    homeScore: number | string,
    awayScore: number | string,
    gameType: string,
    homePlayers: string[],
    awayPlayers: string[]
) => {
    try {
        const response = await axiosInstance.post('/matches', {
            homeTeam,
            awayTeam,
            homeScore,
            awayScore,
            gameType,
            homePlayers,
            awayPlayers,
        });
        return response.data;
    } catch (error) {
        console.error('Błąd dodawania meczu:', error);
        throw error;
    }
};

// Aktualizuj mecz
export const updateMatch = async (
    matchId: string,
    homeTeam: string,
    awayTeam: string,
    homeScore: number | string,
    awayScore: number | string,
    gameType: string,
    homePlayers: string[],
    awayPlayers: string[]
) => {
    try {
        const response = await axiosInstance.put(`/matches/${matchId}`, {
            homeTeam,
            awayTeam,
            homeScore,
            awayScore,
            gameType,
            homePlayers,
            awayPlayers,
        });
        return response.data;
    } catch (error) {
        console.error('Błąd aktualizacji meczu:', error);
        throw error;
    }
};

// Usuń mecz
export const deleteMatch = async (matchId: string) => {
    try {
        await axiosInstance.delete(`/matches/${matchId}`);
    } catch (error) {
        console.error('Błąd usuwania meczu:', error);
        throw error;
    }
};
