// MatchList.tsx
import React, { useEffect, useState } from 'react';
import EditMatch from '../edit-match/EditMatch';
import { deleteMatch, fetchAllMatches } from '../../../api/api-matches';

interface Match {
    _id: string;
    homeTeam: { _id: string; name: string };
    awayTeam: { _id: string; name: string };
    homeScore: number;
    awayScore: number;
    players: Array<{ name: string }>;
    date: string;
}

interface MatchListProps {
    isAuthenticated: boolean;
    isModalOpen: boolean;
    toggleModal(modalState: boolean): void;
}

const MatchList: React.FC<MatchListProps> = ({ isAuthenticated, isModalOpen, toggleModal }) => {
    const [matches, setMatches] = useState<Match[]>([]);
    const [editMatchId, setEditMatchId] = useState<string | null>(null);

    // Pobieranie listy meczów
    useEffect(() => {
        const fetchMatches = async () => {
            try {
                const response = await fetchAllMatches();
                setMatches(response.data);
            } catch (error) {
                console.error('Nie udało się pobrać meczów', error);
            }
        };

        fetchMatches();
    }, []);

    // Funkcja usuwania meczu
    const handleDeleteMatch = async (matchId: string) => {
        try {
            await deleteMatch(matchId);
            setMatches(matches.filter(match => match._id !== matchId));
        } catch (error) {
            console.error('Nie udało się usunąć meczu', error);
        }
    };

    return (
        <div>
            <h2>Lista meczów</h2>
            <ul>
                {matches.map(match => (
                    <li key={match._id}>
                        <p>
                            <strong>{match.homeTeam.name}</strong> {match.homeScore} - {match.awayScore}{' '}
                            <strong>{match.awayTeam.name}</strong>
                        </p>
                        <p>Data: {new Date(match.date).toLocaleDateString()}</p>
                        <p>Gracze: {match.players.map(player => player.name).join(', ')}</p>

                        {isAuthenticated && (
                            <div>
                                <button onClick={() => setEditMatchId(match._id)}>Edytuj</button>
                                <button onClick={() => handleDeleteMatch(match._id)}>Usuń</button>
                            </div>
                        )}

                        {editMatchId === match._id && (
                            <EditMatch matchId={match._id} isModalOpen={isModalOpen} toggleModal={toggleModal} />
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MatchList;
