import React, { useEffect, useState } from 'react';
import styles from './HomaPage.module.scss';
import GeneralTable from '../general-table/GeneralTable';
import Login from '../login/Login';
import { fetchTeams, resetLeagueTable } from '../../api/api-teams';
import AddTeam from '../teams/add-team/AddTeam';
import AddMatch from '../../components/matches/add-match/AddMatch';
import MatchList from '../matches/match-list/MatchList';

const HomePage: React.FC = () => {
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoginModalOpen, setLoginModalOpen] = useState<boolean>(false);
    const [isAddMatchModalOpen, setAddMatchModalOpen] = useState<boolean>(false);
    const [isEditMatchModalOpen, setEditMatchModalOpen] = useState<boolean>(false);

    const toggleLoginModal = (modalState: boolean) => setLoginModalOpen(modalState);
    const toggleAddMatchModal = (modalState: boolean) => setAddMatchModalOpen(modalState);
    const toggleEditMatchModal = (modalState: boolean) => setEditMatchModalOpen(modalState);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true);
        }
    }, []);

    const loadTeams = async () => {
        try {
            const data = await fetchTeams();
            setTeams(data);
        } catch (error) {
            console.error('Błąd pobierania drużyn:', error);
        } finally {
            setLoading(false);
        }
    };

    const resetTable = async () => {
        try {
            await resetLeagueTable();
            alert('Tabela została wyzerowana!');
        } catch (error) {
            console.error('Błąd podczas zerowania tabeli:', error);
        }
    };

    useEffect(() => {
        loadTeams();
    }, []);

    return (
        <div className={styles.homepage}>
            <header className={styles.homepageHeader}>
                <h1>Liga Rozgrywek Kwartalnych</h1>
                <div>
                    {isAuthenticated ? (
                        <button
                            className={styles.homepageLoginButton}
                            onClick={() => {
                                localStorage.removeItem('token');
                                setIsAuthenticated(false);
                            }}>
                            Wyloguj się
                        </button>
                    ) : (
                        <button className={styles.homepageLoginButton} onClick={() => toggleLoginModal(true)}>
                            Zaloguj się
                        </button>
                    )}
                    {isAuthenticated && <button onClick={() => toggleAddMatchModal(true)}>Dodaj mecz</button>}
                    {isAuthenticated && <button onClick={() => resetTable()}>Wyczyść wyniki tabeli</button>}
                </div>
            </header>

            <main>
                {loading ? (
                    <p>Ładowanie tabeli wyników...</p>
                ) : (
                    <>
                        <GeneralTable teams={teams} />
                        {isAuthenticated && <AddTeam onTeamAdded={loadTeams} />}
                        <MatchList
                            isAuthenticated={isAuthenticated}
                            isModalOpen={isEditMatchModalOpen}
                            toggleModal={toggleEditMatchModal}
                        />
                        {!isAuthenticated && <Login isModalOpen={isLoginModalOpen} toggleModal={toggleLoginModal} />}
                        {isAuthenticated && (
                            <AddMatch isModalOpen={isAddMatchModalOpen} toggleModal={toggleAddMatchModal} />
                        )}
                    </>
                )}
            </main>
        </div>
    );
};

export default HomePage;
