// MatchList.tsx
import React, { useEffect, useState } from 'react';
import styles from './MatchList.module.scss';
import EditMatch from '../edit-match/EditMatch';
import { deleteMatch, fetchAllMatches } from '../../../api/api-matches';

interface Match {
    _id: string;
    homeTeam: { _id: string; name: string };
    awayTeam: { _id: string; name: string };
    homeScore: number;
    awayScore: number;
    homePlayers: Array<string>;
    awayPlayers: Array<string>;
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
                setMatches(response);
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
        <div className={styles.container}>
            <h2 className={styles.containerTitle}>Lista meczy</h2>
            <ul className={styles.containerList}>
                {matches.map(match => (
                    <li className={styles.containerListItem} key={match._id}>
                        <p className={styles.containerListItemDate}>
                            <span className={styles.containerListItemDateTitle}>Data:</span>{' '}
                            {new Date(match.date).toLocaleDateString()}
                        </p>
                        <div className={styles.containerMatch}>
                            <div className={styles.containerHomeTeam}>
                                <div className={styles.containerHomeTeamName}>
                                    <strong>{match.homeTeam.name}</strong>
                                    <span className={styles.containerHomeTeamScore}>{match.homeScore}</span>
                                </div>
                                <div className={styles.containerHomeTeamPlayers}>
                                    {match.homePlayers.map((player, index) => (
                                        <p key={index}>{player}</p>
                                    ))}
                                </div>
                            </div>
                            <div className={styles.containerMatchDivider}>{` - `}</div>
                            <div className={styles.containerAwayTeam}>
                                <div className={styles.containerHomeTeamName}>
                                    <span className={styles.containerHomeTeamScore}>{match.awayScore}</span>
                                    <strong>{match.awayTeam.name}</strong>
                                </div>
                                <div className={styles.containerAwayTeamPlayers}>
                                    {match.awayPlayers.map((player, index) => (
                                        <p key={index}>{player}</p>
                                    ))}
                                </div>
                            </div>
                        </div>
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
