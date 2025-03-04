import React, { useEffect, useState } from 'react';
import styles from './MatchList.module.scss';
import EditMatch from '../edit-match/EditMatch';
import { deleteMatch, fetchAllMatches } from '../../../api/api-matches';
import { fetchTeams } from '../../../api/api-teams';
import Button from '../../button/Button';
import classnames from 'classnames';
import { Role } from '../../homepage/HomePage';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';

export interface Match {
    _id: string;
    homeTeam: { _id: string; name: string };
    awayTeam: { _id: string; name: string };
    homeScore: number;
    awayScore: number;
    gameType: string;
    homePlayers: Array<string>;
    awayPlayers: Array<string>;
    screenshot1: string;
    screenshot2: string;
    screenshot3: string;
    date: string;
}

interface Team {
    _id: string;
    name: string;
}

interface MatchListProps {
    isAuthenticated: boolean;
    role: string | null;
    isModalOpen: boolean;
    shouldRefreshMatchList: boolean;
    toggleModal(modalState: boolean): void;
    handleRefreshMatchList(shouldRefresh: boolean): void;
    archivedMatches?: Match[];
    archivedTeams?: Team[];
    isArchivePage?: boolean;
}

const MatchList: React.FC<MatchListProps> = ({
    isAuthenticated,
    isModalOpen,
    toggleModal,
    role,
    shouldRefreshMatchList,
    handleRefreshMatchList,
    archivedMatches,
    archivedTeams,
    isArchivePage,
}) => {
    const [matches, setMatches] = useState<Match[]>([]);
    const [filteredMatches, setFilteredMatches] = useState<Match[]>([]);
    const [teams, setTeams] = useState<Team[]>([]);
    const [activeFilter, setActiveFilter] = useState<string | null>(null);
    const [editMatchId, setEditMatchId] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [photoIndex, setPhotoIndex] = useState(0);
    const [images, setImages] = useState<string[]>([]);

    const fetchMatches = async () => {
        try {
            const response = await fetchAllMatches();
            setMatches(response);
            setFilteredMatches(response);
        } catch (error) {
            console.error('Nie udało się pobrać meczów', error);
        }
    };

    const fetchTeamsList = async () => {
        try {
            const response = await fetchTeams();
            setTeams(response);
        } catch (error) {
            console.error('Nie udało się pobrać drużyn', error);
        }
    };

    useEffect(() => {
        const setArchivedMatches = (archivedMatches: Match[]) => {
            setMatches(archivedMatches);
            setFilteredMatches(archivedMatches);
        };

        archivedMatches ? setArchivedMatches(archivedMatches) : fetchMatches();
        archivedTeams ? setTeams(archivedTeams) : fetchTeamsList();
    }, [archivedMatches, archivedTeams]);

    useEffect(() => {
        if (shouldRefreshMatchList && !isArchivePage) {
            fetchMatches();
            handleRefreshMatchList(false);
        }
    }, [shouldRefreshMatchList, handleRefreshMatchList, isArchivePage]);

    const filterMatchesByTeam = (teamId: string | null) => {
        setActiveFilter(teamId);
        if (!teamId) {
            setFilteredMatches(matches); // Pokaż wszystkie mecze
        } else {
            setFilteredMatches(matches.filter(match => match.homeTeam._id === teamId || match.awayTeam._id === teamId));
        }
    };

    const handleDeleteMatch = async (matchId: string) => {
        const confirmed = window.confirm('Czy na pewno chcesz usunąć mecz?');

        if (confirmed) {
            try {
                await deleteMatch(matchId);
                setMatches(matches.filter(match => match._id !== matchId));
                handleRefreshMatchList(true);
                alert('Mecz usunięty');
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

    const openGallery = (imagePaths: Array<string>) => {
        setImages(imagePaths.map(path => `https://liga-q3.pl/${path}`));
        setPhotoIndex(0);
        setIsOpen(true);
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.containerTitle}>Lista meczy</h2>
            <div className={styles.filterButtons}>
                <button
                    className={`${styles.filterButton} ${activeFilter === null ? styles.active : ''}`}
                    onClick={() => filterMatchesByTeam(null)}>
                    Pokaż wszystkie
                </button>
                {teams.map(team => (
                    <button
                        key={team._id}
                        className={`${styles.filterButton} ${activeFilter === team._id ? styles.active : ''}`}
                        onClick={() => filterMatchesByTeam(team._id)}>
                        {team.name}
                    </button>
                ))}
            </div>
            <ul className={styles.containerList}>
                {filteredMatches
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
                                        {match.homePlayers?.map((player, index) => <p key={index}>{player}</p>)}
                                    </div>
                                </div>
                                <div className={styles.containerMatchScoreScreenContainer}>
                                    <div className={styles.containerMatchScore}>
                                        <div className={styles.containerTeamScore}>{match.homeScore}</div>
                                        <div className={styles.containerMatchScoreDivider}>{' : '}</div>
                                        <span className={styles.containerTeamScore}>{match.awayScore}</span>
                                    </div>
                                    {match.screenshot1 && (
                                        <div className={styles.containerMatchScreens}>
                                            {match.screenshot1 && (
                                                <img
                                                    src={`https://liga-q3.pl/${match.screenshot1}`}
                                                    alt="Screenshot 1"
                                                    loading="eager"
                                                    style={{ width: '50px', height: 'auto', cursor: 'pointer' }}
                                                    onClick={() =>
                                                        openGallery([
                                                            match.screenshot1,
                                                            match.screenshot2,
                                                            match.screenshot3,
                                                        ])
                                                    }
                                                />
                                            )}
                                            {match.screenshot2 && (
                                                <img
                                                    src={`https://liga-q3.pl/${match.screenshot2}`}
                                                    alt="Screenshot 2"
                                                    loading="eager"
                                                    style={{ width: '50px', height: 'auto', cursor: 'pointer' }}
                                                    onClick={() =>
                                                        openGallery([
                                                            match.screenshot1,
                                                            match.screenshot2,
                                                            match.screenshot3,
                                                        ])
                                                    }
                                                />
                                            )}
                                            {match.screenshot3 && (
                                                <img
                                                    src={`https://liga-q3.pl/${match.screenshot3}`}
                                                    alt="Screenshot 2"
                                                    loading="eager"
                                                    style={{ width: '50px', height: 'auto', cursor: 'pointer' }}
                                                    onClick={() =>
                                                        openGallery([
                                                            match.screenshot1,
                                                            match.screenshot2,
                                                            match.screenshot3,
                                                        ])
                                                    }
                                                />
                                            )}
                                        </div>
                                    )}
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
                                        {match.awayPlayers?.map((player, index) => <p key={index}>{player}</p>)}
                                    </div>
                                </div>
                            </div>
                            {isAuthenticated && (role === Role.ADMIN || role === Role.UBER_ADMIN) && !isArchivePage && (
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
            {isOpen && (
                <Lightbox
                    mainSrc={images[photoIndex]}
                    nextSrc={images[(photoIndex + 1) % images.length]}
                    prevSrc={images[(photoIndex + images.length - 1) % images.length]}
                    onCloseRequest={() => setIsOpen(false)}
                    onMovePrevRequest={() => setPhotoIndex((photoIndex + images.length - 1) % images.length)}
                    onMoveNextRequest={() => setPhotoIndex((photoIndex + 1) % images.length)}
                />
            )}
        </div>
    );
};

export default MatchList;
