import React, { useEffect, useState } from 'react';
import styles from './HomaPage.module.scss';
import GeneralTable from '../general-table/GeneralTable';
import Login from '../login/Login';
import { fetchTeams, resetLeagueTable } from '../../api/api-teams';
import { jwtDecode } from 'jwt-decode';
import AddTeam from '../teams/add-team/AddTeam';
import AddMatch from '../../components/matches/add-match/AddMatch';
import MatchList, { Match } from '../matches/match-list/MatchList';
import Button from '../button/Button';
import { fetchAllMatches } from '../../api/api-matches';
import classnames from 'classnames';
import { archiveQuarter } from '../../api/api-archive';

export interface TokenPayload {
    role: string;
}

export enum Role {
    ADMIN = 'admin',
    UBER_ADMIN = 'uberAdmin',
}

const HomePage: React.FC = () => {
    const [teams, setTeams] = useState([]);
    const [matches, setMatches] = useState<Match[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoginModalOpen, setLoginModalOpen] = useState<boolean>(false);
    const [isAddMatchModalOpen, setAddMatchModalOpen] = useState<boolean>(false);
    const [isEditMatchModalOpen, setEditMatchModalOpen] = useState<boolean>(false);
    const [role, setRole] = useState<string | null>(null);
    const [shouldRefreshMatchList, setShouldRefreshMatchList] = useState<boolean>(false);
    const [showCTFTable, setShowCTFTable] = useState<boolean>(false);
    const [showTDMTable, setShowTDMTable] = useState<boolean>(false);

    const toggleLoginModal = (modalState: boolean) => setLoginModalOpen(modalState);
    const toggleAddMatchModal = (modalState: boolean) => setAddMatchModalOpen(modalState);
    const toggleEditMatchModal = (modalState: boolean) => setEditMatchModalOpen(modalState);
    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decoded: TokenPayload = jwtDecode(token);
            setRole(decoded.role);
            setIsAuthenticated(true);
        }
    }, []);

    const handleShowTable = (gameType: string) =>
        gameType === 'CTF' ? setShowCTFTable(!showCTFTable) : setShowTDMTable(!showTDMTable);

    const loadTeams = async () => {
        try {
            const teamsData = await fetchTeams();
            const matchData = await fetchAllMatches();
            setTeams(teamsData);
            setMatches(matchData);
        } catch (error) {
            console.error('Błąd pobierania drużyn:', error);
        } finally {
            setLoading(false);
        }
    };

    const resetTable = async () => {
        const confirmed = window.confirm('Czy na pewno chcesz wyzerować dane tabeli?');

        if (confirmed) {
            try {
                await resetLeagueTable();
                alert('Tabela została wyzerowana!');
            } catch (error) {
                console.error('Błąd podczas zerowania tabeli:', error);
            }
        }
    };

    const archiveQuarterData = async () => {
        const quarter = prompt('Podaj nazwę kwartału (np. "Q1 2025", "Q2 2025"):');

        if (!quarter) {
            alert('Musisz podać nazwę kwartału!');
            return;
        }

        const confirmed = window.confirm('Czy na pewno chcesz zarchiwizować ten kwartał?');

        if (confirmed) {
            try {
                // Zamiast używać fetch bezpośrednio, wywołaj funkcję archiveQuarter
                const response = await archiveQuarter(quarter, teams, matches);

                if (!response.error) {
                    alert(response.message || 'Kwartał został zarchiwizowany!');
                    window.location.reload();
                } else {
                    alert(response.error || 'Błąd podczas archiwizowania kwartału');
                }
            } catch (error) {
                console.error('Błąd podczas archiwizowania kwartału:', error);
                alert('Błąd podczas archiwizowania kwartału');
            }
        }
    };

    const handleRefreshMatchList = React.useCallback((shouldRefresh: boolean) => {
        setShouldRefreshMatchList(shouldRefresh);
    }, []);

    useEffect(() => {
        loadTeams();
    }, []);

    return (
        <div className={styles.homepage}>
            <header className={styles.homepageHeader}>
                <h1>Liga Rozgrywek Kwartalnych</h1>
                <div className={styles.homepageHeaderBtns}>
                    {isAuthenticated ? (
                        <Button label={'Wyloguj się'} onClick={() => handleLogout()} />
                    ) : (
                        <Button label={'Zaloguj się'} onClick={() => toggleLoginModal(true)} />
                    )}
                    {isAuthenticated && <Button label={'Dodaj mecz'} onClick={() => toggleAddMatchModal(true)} />}
                    {isAuthenticated && (role === Role.ADMIN || role === Role.UBER_ADMIN) && (
                        <Button label={'Zarchiwizuj kwartał'} onClick={() => archiveQuarterData()} />
                    )}
                    {isAuthenticated && role === Role.UBER_ADMIN && (
                        <Button label={'Wyczyść wyniki tabeli'} onClick={() => resetTable()} />
                    )}
                </div>
                {isAuthenticated && (role === Role.ADMIN || role === Role.UBER_ADMIN) && (
                    <AddTeam onTeamAdded={loadTeams} />
                )}
            </header>

            <main>
                {loading ? (
                    <p>Ładowanie tabeli wyników...</p>
                ) : (
                    <>
                        <div className={styles.generalTable}>
                            <p className={styles.generalTableTitle}>Tabela Ogólna</p>
                            <GeneralTable teams={teams} matches={matches} />
                        </div>
                        <div className={styles.generalTable}>
                            <div onClick={() => handleShowTable('CTF')} className={styles.generalTableText}>
                                <span className={styles.generalTableTitle}>Tabela CTF</span>
                                <span
                                    className={classnames(styles.generalTableChevron, {
                                        [styles.generalTableChevronDown]: !showCTFTable,
                                        [styles.generalTableChevronUp]: showCTFTable,
                                    })}
                                />
                            </div>
                            <div
                                className={classnames(styles.generalTableContent, {
                                    [styles.generalTableContentHidden]: !showCTFTable,
                                    [styles.generalTableContentShow]: showCTFTable,
                                })}>
                                <GeneralTable teams={teams} matches={matches} gameType={'CTF'} />
                            </div>
                        </div>
                        <div className={styles.generalTable}>
                            <div onClick={() => handleShowTable('TDM')} className={styles.generalTableText}>
                                <span className={styles.generalTableTitle}>Tabela TDM</span>
                                <span
                                    className={classnames(styles.generalTableChevron, {
                                        [styles.generalTableChevronDown]: !showTDMTable,
                                        [styles.generalTableChevronUp]: showTDMTable,
                                    })}
                                />
                            </div>
                            <div
                                className={classnames(styles.generalTableContent, {
                                    [styles.generalTableContentHidden]: !showTDMTable,
                                    [styles.generalTableContentShow]: showTDMTable,
                                })}>
                                <GeneralTable teams={teams} matches={matches} gameType={'TDM'} />
                            </div>
                        </div>
                        <MatchList
                            handleRefreshMatchList={handleRefreshMatchList}
                            shouldRefreshMatchList={shouldRefreshMatchList}
                            role={role}
                            isAuthenticated={isAuthenticated}
                            isModalOpen={isEditMatchModalOpen}
                            toggleModal={toggleEditMatchModal}
                        />
                        {!isAuthenticated && <Login isModalOpen={isLoginModalOpen} toggleModal={toggleLoginModal} />}
                        {isAuthenticated && (
                            <AddMatch
                                isModalOpen={isAddMatchModalOpen}
                                toggleModal={toggleAddMatchModal}
                                refreshMatchList={handleRefreshMatchList}
                            />
                        )}
                    </>
                )}
            </main>
        </div>
    );
};

export default HomePage;
