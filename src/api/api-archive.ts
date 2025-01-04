// src/api/teamsApi.ts
import axiosInstance from './axiosConfig';
import { Match } from '@/components/matches/match-list/MatchList';
import { Team } from '@/components/general-table/GeneralTable';

export const archiveQuarter = async (quarter: string, teams: Team[], matches: Match[]) => {
    try {
        const response = await axiosInstance.post(`/archive`, { quarter, teams, matches });

        if (response.data.ok) {
            return { ok: true, message: response.data.message };
        } else {
            return { ok: false, error: response.data.error };
        }
    } catch (error) {
        console.error('Błąd podczas archiwizowania kwartału:', error);
        return { ok: false, error: 'Błąd podczas archiwizowania kwartału' };
    }
};

export const getArchivedQuarters = async (): Promise<string[]> => {
    const response = await axiosInstance.get('/archive/archived-results');
    return response.data;
};

export const getArchivedQuarterData = async (quarter: string): Promise<{ teams: any[]; matches: any[] }> => {
    const response = await axiosInstance.get(`/archive/archived-results/${quarter}`);
    return response.data;
};
