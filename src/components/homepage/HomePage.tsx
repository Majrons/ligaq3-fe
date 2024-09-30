import React, { useEffect, useState } from 'react';
import styles from './HomaPage.module.scss';
import GeneralTable from '../general-table/GeneralTable';
import Login from '../login/Login';
import { fetchTeams } from '../../api/api-teams';
import AddTeam from '../teams/add-team/AddTeam';
import AddMatch from '../../components/matches/add-match/AddMatch';

const HomePage: React.FC = () => {
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoginModalOpen, setLoginModalOpen] = useState<boolean>(false);
    const [isAddMatchModalOpen, setAddMatchModalOpen] = useState<boolean>(false);

    const toggleLoginModal = (modalState: boolean) => setLoginModalOpen(modalState);
    const toggleAddMatchModal = (modalState: boolean) => setAddMatchModalOpen(modalState);

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
                </div>
            </header>

            <main>
                {loading ? (
                    <p>Ładowanie tabeli wyników...</p>
                ) : (
                    <>
                        <GeneralTable teams={teams} />
                        {isAuthenticated && <AddTeam onTeamAdded={loadTeams} />}
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
