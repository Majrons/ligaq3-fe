import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './HomaPage.module.scss';
import GeneralTable from '../general-table/GeneralTable';

const HomePage: React.FC = () => {
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const response = await axios.get('/api/teams'); // Endpoint do pobrania drużyn
                setTeams(response.data);
            } catch (error) {
                console.error('Błąd pobierania danych:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTeams();
    }, []);

    return (
        <div className={styles.homepage}>
            <header className="main-header">
                <h1>Liga Rozgrywek</h1>
                <button className="login-button" onClick={() => alert('Przejdź do logowania')}>
                    Zaloguj się
                </button>
            </header>

            <main>{loading ? <p>Ładowanie tabeli wyników...</p> : <GeneralTable teams={teams} />}</main>
        </div>
    );
};

export default HomePage;
