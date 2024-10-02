import React, { useState, useEffect } from 'react';
import ModalComponent from '../../modal/ModalComponent';
import { fetchPlayersByTeam } from '../../../api/api-players';
import { fetchTeamsByMatchId } from '../../../api/api-teams';
import { fetchMatch, updateMatch } from '../../../api/api-matches';
import styles from './EditMatch.module.scss';
import { addMatchTheme } from '../../../assets/styles/theme';
import { TextField, ThemeProvider } from '@mui/material';

interface IEditMatchProps {
    matchId: string;
    isModalOpen: boolean;
    toggleModal: (modalState: boolean) => void;
}

interface Team {
    _id: string;
    name: string;
}

interface Player {
    _id: string;
    name: string;
    teamId: string;
}

const EditMatch: React.FC<IEditMatchProps> = ({ matchId, isModalOpen, toggleModal }) => {
    const [homeTeam, setHomeTeam] = useState<Team | null>(null);
    const [awayTeam, setAwayTeam] = useState<Team | null>(null);
    const [homePlayers, setHomePlayers] = useState<string[]>([]);
    const [awayPlayers, setAwayPlayers] = useState<string[]>([]);
    const [homeScore, setHomeScore] = useState<number>(0);
    const [awayScore, setAwayScore] = useState<number>(0);
    const [players, setPlayers] = useState<Player[]>([]);

    // Pobieranie drużyn na podstawie meczu
    useEffect(() => {
        const fetchTeamsAndPlayers = async () => {
            try {
                const { homeTeam, awayTeam } = await fetchTeamsByMatchId(matchId);
                setHomeTeam(homeTeam);
                setAwayTeam(awayTeam);

                // Pobierz graczy dla każdej z drużyn
                const homePlayersResponse = await fetchPlayersByTeam(homeTeam._id);
                const awayPlayersResponse = await fetchPlayersByTeam(awayTeam._id);

                setPlayers([...homePlayersResponse, ...awayPlayersResponse]);
            } catch (error) {
                console.error('Nie udało się pobrać drużyn lub graczy', error);
            }
        };

        fetchTeamsAndPlayers();
    }, [matchId]);

    // Pobieranie danych meczu
    useEffect(() => {
        const handleFetchMatch = async () => {
            try {
                const response = await fetchMatch(matchId);
                const { homeScore, awayScore, homePlayers, awayPlayers } = response.data;

                setHomeScore(homeScore);
                setAwayScore(awayScore);
                setHomePlayers(homePlayers || []);
                setAwayPlayers(awayPlayers || []);
            } catch (error) {
                console.error('Nie udało się pobrać danych meczu', error);
            }
        };

        if (matchId) {
            handleFetchMatch();
        }
    }, [matchId]);

    // Funkcja aktualizacji meczu
    const handleUpdateMatch = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await updateMatch(matchId, homeTeam!._id, awayTeam!._id, homeScore, awayScore, homePlayers, awayPlayers);

            alert('Mecz został zaktualizowany!');
            toggleModal(false);
        } catch (error) {
            console.error('Nie udało się zaktualizować meczu', error);
        }
    };

    return (
        <ModalComponent modalIsOpen={isModalOpen} closeModal={toggleModal}>
            <div className={styles.container}>
                <form onSubmit={handleUpdateMatch}>
                    <h2>Edytuj mecz</h2>
                    <div className={styles.containerWrapper}>
                        <label className={styles.containerLabel}>Drużyna #1</label>
                        <select value={homeTeam?._id} onChange={e => setHomeTeam(homeTeam)} required>
                            <option value="">Wybierz drużynę</option>
                            {homeTeam && (
                                <option key={homeTeam._id} value={homeTeam._id}>
                                    {homeTeam.name}
                                </option>
                            )}
                        </select>
                    </div>
                    <div className={styles.containerWrapper}>
                        <label className={styles.containerLabel}>Gracze drużyny #1</label>
                        <select
                            multiple
                            value={homePlayers}
                            onChange={e =>
                                setHomePlayers(Array.from(e.target.selectedOptions, option => option.value))
                            }>
                            {players
                                .filter(player => player.teamId === homeTeam?._id)
                                .map(player => (
                                    <option key={player._id} value={player._id}>
                                        {player.name}
                                    </option>
                                ))}
                        </select>
                    </div>
                    <div className={styles.containerWrapper}>
                        <label className={styles.containerLabel}>Drużyna #2</label>
                        <select value={awayTeam?._id} onChange={e => setAwayTeam(awayTeam)} required>
                            <option value="">Wybierz drużynę</option>
                            {awayTeam && (
                                <option key={awayTeam._id} value={awayTeam._id}>
                                    {awayTeam.name}
                                </option>
                            )}
                        </select>
                    </div>
                    <div className={styles.containerWrapper}>
                        <label className={styles.containerLabel}>Gracze drużyny #2</label>
                        <select
                            multiple
                            value={awayPlayers}
                            onChange={e =>
                                setAwayPlayers(Array.from(e.target.selectedOptions, option => option.value))
                            }>
                            {players
                                .filter(player => player.teamId === awayTeam?._id)
                                .map(player => (
                                    <option key={player._id} value={player._id}>
                                        {player.name}
                                    </option>
                                ))}
                        </select>
                    </div>
                    <div className={styles.containerWrapper}>
                        <label className={styles.containerLabel}>Wynik {homeTeam?.name}</label>
                        <ThemeProvider theme={addMatchTheme}>
                            <TextField
                                id="outlined-basic"
                                type="number"
                                variant="outlined"
                                className={styles.addTeamInput}
                                label={'Wynik'}
                                onChange={e => setHomeScore(e.target.value ? Number(e.target.value) : 0)}
                                value={homeScore}
                                required
                            />
                        </ThemeProvider>
                    </div>
                    <div className={styles.containerWrapper}>
                        <label className={styles.containerLabel}>Wynik {awayTeam?.name}</label>
                        <ThemeProvider theme={addMatchTheme}>
                            <TextField
                                id="outlined-basic"
                                type="number"
                                variant="outlined"
                                className={styles.addTeamInput}
                                label={'Wynik'}
                                onChange={e => setAwayScore(e.target.value ? Number(e.target.value) : 0)}
                                value={awayScore}
                                required
                            />
                        </ThemeProvider>
                    </div>
                    <div>
                        <button type="submit">Zaktualizuj mecz</button>
                        <button onClick={() => toggleModal(false)}>Anuluj</button>
                    </div>
                </form>
            </div>
        </ModalComponent>
    );
};

export default EditMatch;
