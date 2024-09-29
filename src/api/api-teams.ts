// src/api/teamsApi.ts
import axiosInstance from './axiosConfig';

export const fetchTeam = async (teamId: string) => {
    const response = await axiosInstance.get(`/teams/${teamId}`);
    return response.data;
};

export const fetchTeams = async () => {
    try {
        const response = await axiosInstance.get('/teams'); // Wysłanie zapytania GET do API
        return response.data; // Zwrócenie danych o drużynach
    } catch (error) {
        console.error('Błąd pobierania drużyn:', error);
        throw error;
    }
};

export const addTeam = async (teamName: string) => {
    const response = await axiosInstance.post('/teams', { name: teamName });
    return response.data;
};