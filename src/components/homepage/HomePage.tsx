import React, { useEffect, useState } from 'react';
import styles from './HomaPage.module.scss';
import GeneralTable from '../general-table/GeneralTable';
import Login from '../login/Login';
import { fetchTeams } from '../../api/api-teams';
import AddTeam from '../teams/add-team/AddTeam';

const HomePage: React.FC = () => {
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isModalOpen, setModalOpen] = useState<boolean>(false);

    const toggleModal = (modalState: boolean) => setModalOpen(modalState);

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
                    <button className={styles.homepageLoginButton} onClick={() => toggleModal(true)}>
                        Zaloguj się
                    </button>
                )}
            </header>

            <main>
                {loading ? (
                    <p>Ładowanie tabeli wyników...</p>
                ) : (
                    <>
                        <GeneralTable teams={teams} />
                        {isAuthenticated && <AddTeam onTeamAdded={loadTeams} />}
                        {!isAuthenticated && <Login isModalOpen={isModalOpen} toggleModal={toggleModal} />}
                    </>
                )}
            </main>
        </div>
    );
};

export default HomePage;
