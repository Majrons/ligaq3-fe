// src/api/teamsApi.ts
import axiosInstance from './axioxConfig';

export const fetchTeams = async () => {
    try {
        const response = await axiosInstance.get('/teams'); // Wysłanie zapytania GET do API
        return response.data; // Zwrócenie danych o drużynach
    } catch (error) {
        console.error('Błąd pobierania drużyn:', error);
        throw error;
    }
};
