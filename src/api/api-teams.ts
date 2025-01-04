// src/api/teamsApi.ts
import axiosInstance from './axiosConfig';

export const fetchTeam = async (teamId: string) => {
    const response = await axiosInstance.get(`/teams/${teamId}`);
    return response.data;
};

export const fetchTeams = async () => {
    try {
        const response = await axiosInstance.get('/teams');
        return response.data;
    } catch (error) {
        console.error('Błąd pobierania drużyn:', error);
        throw error;
    }
};

export const addTeam = async (teamName: string) => {
    const response = await axiosInstance.post('/teams', { name: teamName });
    return response.data;
};

export const updateTeam = async (id: string, name: string) => {
    const response = await axiosInstance.put(`/teams/${id}`, { name });
    return response.data;
};

export const deleteTeam = async (id: string) => {
    const response = await axiosInstance.delete(`/teams/${id}`);
    return response.data;
};

export const resetLeagueTable = async () => {
    try {
        const response = await axiosInstance.post('/teams/reset');
        return response.data;
    } catch (error) {
        console.error('Błąd podczas resetowania tabeli ligowej:', error);
        throw error;
    }
};

export const fetchTeamsByMatchId = async (matchId: string) => {
    try {
        const response = await axiosInstance.get(`/teams/match/${matchId}`);
        return response.data;
    } catch (error) {
        console.error('Błąd pobierania drużyn dla meczu:', error);
        throw error;
    }
};
