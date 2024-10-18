import React, { useState, useEffect } from 'react';
import ModalComponent from '../../modal/ModalComponent';
import { fetchPlayersByTeam } from '../../../api/api-players';
import { fetchTeams } from '../../../api/api-teams';
import { fetchMatch, updateMatch } from '../../../api/api-matches';
import styles from './EditMatch.module.scss';
import { TextField, ThemeProvider } from '@mui/material';
import { addMatchTheme } from '../../../assets/styles/theme';
import Button from '../../button/Button';

interface IEditMatchProps {
    matchId: string;
    isModalOpen: boolean;
    toggleModal: (modalState: boolean) => void;
    handleRefreshMatchList(shouldRefresh: boolean): void;
}

interface Team {
    _id: string;
    name: string;
}

interface Player {
    _id: string;
    name: string;
}

const EditMatch: React.FC<IEditMatchProps> = ({ matchId, isModalOpen, toggleModal, handleRefreshMatchList }) => {
    const [teams, setTeams] = useState<Team[]>([]);
    const [homeTeamID, setHomeTeamID] = useState<string>('');
    const [homeTeam, setHomeTeam] = useState<string>('');
    const [awayTeamID, setAwayTeamID] = useState<string>('');
    const [awayTeam, setAwayTeam] = useState<string>('');
    const [homeScore, setHomeScore] = useState<number | string>(0);
    const [awayScore, setAwayScore] = useState<number | string>(0);
    const [gameType, setGameType] = useState<string>('CTF');
    const [homePlayers, setHomePlayers] = useState<Player[]>([]);
    const [awayPlayers, setAwayPlayers] = useState<Player[]>([]);
    const [selectedHomePlayers, setSelectedHomePlayers] = useState<string[]>([]);
    const [selectedAwayPlayers, setSelectedAwayPlayers] = useState<string[]>([]);

    // Pobieranie drużyn i danych meczu
    useEffect(() => {
        const fetchMatchData = async () => {
            try {
                const match = await fetchMatch(matchId);
                const { homeTeam, awayTeam, homePlayers, awayPlayers, homeScore, awayScore, gameType } = match;

                setHomeTeamID(homeTeam._id);
                setHomeTeam(homeTeam.name);
                setAwayTeamID(awayTeam._id);
                setAwayTeam(awayTeam.name);
                setSelectedHomePlayers(homePlayers);
                setSelectedAwayPlayers(awayPlayers);
                setHomeScore(homeScore);
                setAwayScore(awayScore);
                setGameType(gameType);

                const teamsResponse = await fetchTeams();
                setTeams(teamsResponse);

                const homePlayersResponse = await fetchPlayersByTeam(homeTeam._id);
                const awayPlayersResponse = await fetchPlayersByTeam(awayTeam._id);

                setHomePlayers(homePlayersResponse);
                setAwayPlayers(awayPlayersResponse);
            } catch (error) {
                console.error('Nie udało się pobrać danych meczu:', error);
            }
        };

        fetchMatchData();
    }, [matchId]);

    const handleUpdateMatch = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await updateMatch(
                matchId,
                homeTeamID,
                awayTeamID,
                homeScore,
                awayScore,
                gameType,
                selectedHomePlayers,
                selectedAwayPlayers
            );
            alert('Mecz został zaktualizowany!');
            toggleModal(false);
            handleRefreshMatchList(true);
        } catch (error) {
            console.error('Nie udało się zaktualizować meczu', error);
        }
    };

    const handlePlayerSelection = (team: string, playerName: string, selected: boolean) => {
        if (team === 'home') {
            setSelectedHomePlayers([]);
            setSelectedHomePlayers(prev =>
                selected ? [...selectedHomePlayers, playerName] : prev.filter(name => name !== playerName)
            );
        } else {
            setSelectedAwayPlayers([]);
            setSelectedAwayPlayers(prev =>
                selected ? [...selectedAwayPlayers, playerName] : prev.filter(name => name !== playerName)
            );
        }
    };

    return (
        <ModalComponent modalIsOpen={isModalOpen} closeModal={toggleModal}>
            <div className={styles.container}>
                <form className={styles.containerForm} onSubmit={handleUpdateMatch}>
                    <h2>Edytuj mecz</h2>
                    <div className={styles.containerWrapper}>
                        <label className={styles.containerLabel}>Drużyna #1</label>
                        <select
                            className={styles.containerSelect}
                            value={homeTeam}
                            onChange={e => setHomeTeam(e.target.value ? e.target.value : homeTeam)}
                            required>
                            <option value={homeTeam}>{homeTeam}</option>
                        </select>
                    </div>
                    <div className={styles.containerWrapper}>
                        <label className={styles.containerLabel}>Drużyna #2</label>
                        <select
                            className={styles.containerSelect}
                            value={awayTeam}
                            onChange={e => setAwayTeam(e.target.value ? e.target.value : awayTeam)}
                            required>
                            <option value={awayTeam}>{awayTeam}</option>
                        </select>
                    </div>
                    <div className={styles.containerWrapper}>
                        <label className={styles.containerLabel}>Co było grane</label>
                        <select
                            className={styles.containerSelect}
                            value={gameType}
                            onChange={e => setGameType(e.target.value ? e.target.value : gameType)}
                            required>
                            <option value="TDM">TDM</option>
                            <option value="CTF">CTF</option>
                        </select>
                    </div>
                    <div className={styles.containerWrapper}>
                        <label className={styles.containerLabel}>Wynik {homeTeam}</label>
                        <ThemeProvider theme={addMatchTheme}>
                            <TextField
                                id="outlined-basic"
                                type="number"
                                variant="outlined"
                                className={styles.addTeamInput}
                                label={'Wynik'}
                                onFocus={() => setHomeScore('')}
                                onBlur={() => setHomeScore(homeScore === '' ? 0 : homeScore)}
                                onChange={e => {
                                    const value = e.target.value;
                                    if (!isNaN(Number(value))) {
                                        setHomeScore(value === '' ? '' : Number(value));
                                    }
                                }}
                                value={homeScore}
                                required
                            />
                        </ThemeProvider>
                    </div>
                    <div className={styles.containerWrapper}>
                        <label className={styles.containerLabel}>Wynik {awayTeam}</label>
                        <ThemeProvider theme={addMatchTheme}>
                            <TextField
                                id="outlined-basic"
                                type="number"
                                variant="outlined"
                                className={styles.addTeamInput}
                                label={'Wynik'}
                                onFocus={() => setAwayScore('')}
                                onBlur={() => setAwayScore(awayScore === '' ? 0 : awayScore)}
                                onChange={e => {
                                    const value = e.target.value;
                                    if (!isNaN(Number(value))) {
                                        setAwayScore(value === '' ? '' : Number(value));
                                    }
                                }}
                                value={awayScore}
                                required
                            />
                        </ThemeProvider>
                    </div>
                    <div className={styles.containerChoosePlayers}>
                        {homeTeam && (
                            <div>
                                <h3>
                                    Wybierz graczy <br /> {teams.find(t => t._id === homeTeamID)?.name}
                                </h3>
                                {homePlayers?.map(player => (
                                    <div key={player._id}>
                                        <input
                                            type="checkbox"
                                            id={`home-${player._id}`}
                                            checked={selectedHomePlayers.includes(player.name)}
                                            onChange={e => handlePlayerSelection('home', player.name, e.target.checked)}
                                        />
                                        <label htmlFor={`home-${player._id}`}>{player.name}</label>
                                    </div>
                                ))}
                            </div>
                        )}
                        {awayTeam && (
                            <div>
                                <h3>
                                    Wybierz graczy <br /> {teams.find(t => t._id === awayTeamID)?.name}
                                </h3>
                                {awayPlayers?.map(player => (
                                    <div key={player._id}>
                                        <input
                                            type="checkbox"
                                            id={`away-${player._id}`}
                                            checked={selectedAwayPlayers.includes(player.name)}
                                            onChange={e => handlePlayerSelection('away', player.name, e.target.checked)}
                                        />
                                        <label htmlFor={`away-${player._id}`}>{player.name}</label>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className={styles.containerButtons}>
                        <Button label={'Zaktualizuj mecz'} type={'submit'} />
                        <Button label={'Anuluj'} onClick={() => toggleModal(false)} />
                    </div>
                </form>
            </div>
        </ModalComponent>
    );
};

export default EditMatch;
