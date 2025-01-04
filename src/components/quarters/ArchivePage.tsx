import React, { useState, useEffect } from 'react';
import { Button, Typography, CircularProgress } from '@mui/material';
import GeneralTable from '../general-table/GeneralTable';
import { getArchivedQuarters, getArchivedQuarterData } from '../../api/api-archive';
import styles from './ArchivedQuarterPage.module.scss';
import TeamsPage from '../teams/teams-page/TeamsPage';
import MatchList from '../matches/match-list/MatchList';

const ArchivedQuarterPage: React.FC = () => {
    const [quarters, setQuarters] = useState<string[]>([]);
    const [selectedQuarter, setSelectedQuarter] = useState<string | null>(null);
    const [teams, setTeams] = useState<any[]>([]);
    const [matches, setMatches] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    // Pobieranie listy zarchiwizowanych kwartałów
    useEffect(() => {
        const fetchQuarters = async () => {
            try {
                const data = await getArchivedQuarters();
                setQuarters(data);
            } catch (error) {
                console.error('Błąd podczas pobierania listy kwartałów:', error);
            }
        };

        fetchQuarters();
    }, []);

    // Pobieranie danych dla wybranego kwartału
    const fetchQuarterData = async (quarter: string) => {
        setLoading(true);
        try {
            const data = await getArchivedQuarterData(quarter);
            setTeams(data.teams || []);
            setMatches(data.matches || []);
            setSelectedQuarter(quarter);
        } catch (error) {
            console.error('Błąd podczas pobierania danych dla kwartału:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <Typography variant="h4" gutterBottom>
                Archiwum Kwartałów
            </Typography>
            <div className={styles.quarterButtons}>
                {quarters.map(quarter => (
                    <Button key={quarter} variant="contained" color="primary" onClick={() => fetchQuarterData(quarter)}>
                        {quarter}
                    </Button>
                ))}
            </div>
            {loading && <CircularProgress />}
            {selectedQuarter && (
                <>
                    <>
                        <Typography variant="h5" gutterBottom>
                            Dane dla kwartału: {selectedQuarter}
                        </Typography>
                        <div className={styles.tableContainer}>
                            <h2>Tabela Generalna</h2>
                            <GeneralTable teams={teams} matches={matches} isArchivePage={true} />
                        </div>
                        <div className={styles.tableContainer}>
                            <h2>Tabela CTF</h2>
                            <GeneralTable teams={teams} matches={matches} gameType={'CTF'} isArchivePage={true} />
                        </div>
                        <div className={styles.tableContainer}>
                            <h2>Tabela TDM</h2>
                            <GeneralTable teams={teams} matches={matches} gameType={'TDM'} isArchivePage={true} />
                        </div>
                    </>
                    <TeamsPage teamsArray={teams} />
                    <MatchList
                        archivedMatches={matches}
                        archivedTeams={teams}
                        handleRefreshMatchList={() => false}
                        shouldRefreshMatchList={false}
                        isArchivePage={true}
                        role={'mod'}
                        isModalOpen={false}
                        isAuthenticated={false}
                        toggleModal={() => false}
                    />
                </>
            )}
        </div>
    );
};

export default ArchivedQuarterPage;
