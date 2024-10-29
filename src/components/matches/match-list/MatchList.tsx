// MatchList.tsx
import React, { useEffect, useState } from 'react';
import styles from './MatchList.module.scss';
import EditMatch from '../edit-match/EditMatch';
import { deleteMatch, fetchAllMatches } from '../../../api/api-matches';
import Button from '../../button/Button';
import classnames from 'classnames';
import { Role } from '../../homepage/HomePage';

export interface Match {
    _id: string;
    homeTeam: { _id: string; name: string };
    awayTeam: { _id: string; name: string };
    homeScore: number;
    awayScore: number;
    gameType: string;
    homePlayers: Array<string>;
    awayPlayers: Array<string>;
    date: string;
}

interface MatchListProps {
    isAuthenticated: boolean;
    role: string | null;
    isModalOpen: boolean;
    shouldRefreshMatchList: boolean;
    toggleModal(modalState: boolean): void;
    handleRefreshMatchList(shouldRefresh: boolean): void;
}

const MatchList: React.FC<MatchListProps> = ({
    isAuthenticated,
    isModalOpen,
    toggleModal,
    role,
    shouldRefreshMatchList,
    handleRefreshMatchList,
}) => {
    const [matches, setMatches] = useState<Match[]>([]);
    const [editMatchId, setEditMatchId] = useState<string | null>(null);

    const fetchMatches = async () => {
        try {
            const response = await fetchAllMatches();
            setMatches(response);
        } catch (error) {
            console.error('Nie udało się pobrać meczów', error);
        }
    };

    useEffect(() => {
        fetchMatches();
    }, []);

    useEffect(() => {
        if (shouldRefreshMatchList) {
            fetchMatches();
            handleRefreshMatchList(false);
        }
    }, [shouldRefreshMatchList, handleRefreshMatchList]);

    const handleDeleteMatch = async (matchId: string) => {
        const confirmed = window.confirm('Czy na pewno chcesz usunąć mecz?');

        if (confirmed) {
            try {
                await deleteMatch(matchId);
                setMatches(matches.filter(match => match._id !== matchId));
                handleRefreshMatchList(true);
                alert('Mecz usuniety');
            } catch (error) {
                console.error('Nie udało się usunąć meczu', error);
                alert(`Pisz do KreC!ka', ${error}`);
            }
        }
    };

    const handlEdit = (matchId: string) => {
        toggleModal(true);
        setEditMatchId(matchId);
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.containerTitle}>Lista meczy</h2>
            <ul className={styles.containerList}>
                {matches
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map(match => (
                        <li className={styles.containerListItem} key={match._id}>
                            <div className={styles.containerListItemTitle}>
                                <p className={styles.containerListItemDate}>
                                    <span className={styles.containerListItemDateTitle}>Data:</span>{' '}
                                    {new Date(match.date).toLocaleDateString()}
                                </p>
                                <p className={styles.containerListItemDate}>Typ meczu: {match.gameType}</p>
                            </div>
                            <div className={styles.containerMatch}>
                                <div className={styles.containerTeam}>
                                    <div className={classnames(styles.containerTeamName, styles.containerTeamNameHome)}>
                                        <strong>{match.homeTeam.name}</strong>
                                    </div>
                                    <div
                                        className={classnames(
                                            styles.containerTeamPlayers,
                                            styles.containerTeamPlayersHome
                                        )}>
                                        {match.homePlayers.map((player, index) => (
                                            <p key={index}>{player}</p>
                                        ))}
                                    </div>
                                </div>
                                <div className={styles.containerMatchScore}>
                                    <div className={styles.containerTeamScore}>{match.homeScore}</div>
                                    <div className={styles.containerMatchScoreDivider}>{' : '}</div>
                                    <span className={styles.containerTeamScore}>{match.awayScore}</span>
                                </div>
                                <div className={styles.containerTeam}>
                                    <div className={classnames(styles.containerTeamName, styles.containerTeamNameAway)}>
                                        <strong>{match.awayTeam.name}</strong>
                                    </div>
                                    <div
                                        className={classnames(
                                            styles.containerTeamPlayers,
                                            styles.containerTeamPlayersAway
                                        )}>
                                        {match.awayPlayers.map((player, index) => (
                                            <p key={index}>{player}</p>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            {isAuthenticated && role === Role.ADMIN && (
                                <div className={styles.containerListItemButtons}>
                                    <Button
                                        classes={styles.containerListItemButtonsBtn}
                                        onClick={() => handlEdit(match._id)}
                                        label={'Edytuj'}
                                    />
                                    <Button
                                        classes={styles.containerListItemButtonsBtn}
                                        onClick={() => handleDeleteMatch(match._id)}
                                        label={'Usuń'}
                                    />
                                </div>
                            )}

                            {editMatchId === match._id && (
                                <EditMatch
                                    matchId={match._id}
                                    isModalOpen={isModalOpen}
                                    toggleModal={toggleModal}
                                    handleRefreshMatchList={handleRefreshMatchList}
                                />
                            )}
                        </li>
                    ))}
            </ul>
        </div>
    );
};

export default MatchList;
