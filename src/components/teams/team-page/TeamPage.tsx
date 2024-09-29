import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchTeam } from '../../../api/api-teams';

interface Team {
    _id: string;
    name: string;
    wins: number;
    losses: number;
    matchesPlayed: number;
}

const TeamPage: React.FC = () => {
    const { teamId } = useParams<{ teamId: string }>();
    const [team, setTeam] = useState<Team | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadTeam = async () => {
            try {
                const data = await fetchTeam(teamId || '');
                setTeam(data);
            } catch (error) {
                console.error('Błąd pobierania drużyny:', error);
            } finally {
                setLoading(false);
            }
        };

        if (teamId) {
            loadTeam();
        }
    }, [teamId]);

    if (loading) {
        return <p>Ładowanie danych drużyny...</p>;
    }

    if (!team) {
        return <p>Nie znaleziono drużyny.</p>;
    }

    return (
        <div className="team-page">
            <h1>{team.name}</h1>
            <p>Wygrane: {team.wins}</p>
            <p>Przegrane: {team.losses}</p>
            <p>Rozegrane mecze: {team.matchesPlayed}</p>
            <p>Procent wygranych: {((team.wins / team.matchesPlayed) * 100).toFixed(2)}%</p>
        </div>
    );
};

export default TeamPage;
