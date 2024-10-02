import React, { useEffect, useState } from 'react';
import styles from './HomaPage.module.scss';
import GeneralTable from '../general-table/GeneralTable';
import Login from '../login/Login';
import { fetchTeams, resetLeagueTable } from '../../api/api-teams';
import { jwtDecode } from 'jwt-decode';
import AddTeam from '../teams/add-team/AddTeam';
import AddMatch from '../../components/matches/add-match/AddMatch';
import MatchList from '../matches/match-list/MatchList';
import Button from '../button/Button';

export interface TokenPayload {
    role: string;
}

export enum Role {
    ADMIN = 'admin',
}

const HomePage: React.FC = () => {
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoginModalOpen, setLoginModalOpen] = useState<boolean>(false);
    const [isAddMatchModalOpen, setAddMatchModalOpen] = useState<boolean>(false);
    const [isEditMatchModalOpen, setEditMatchModalOpen] = useState<boolean>(false);
    const [role, setRole] = useState<string | null>(null);

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
                    {isAuthenticated && role === Role.ADMIN && (
                        <Button label={'Wyczyść wyniki tabeli'} onClick={() => resetTable()} />
                    )}
                </div>
            </header>

            <main>
                {loading ? (
                    <p>Ładowanie tabeli wyników...</p>
                ) : (
                    <>
                        <GeneralTable teams={teams} />
                        {isAuthenticated && role === Role.ADMIN && <AddTeam onTeamAdded={loadTeams} />}
                        <MatchList
                            role={role}
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
