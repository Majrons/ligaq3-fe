import React, { useState, useEffect } from 'react';
import styles from './AddMatch.module.scss';
import ModalComponent from '../../modal/ModalComponent';
import { fetchPlayersByTeam } from '../../../api/api-players';
import { fetchTeams } from '../../../api/api-teams';
import { addMatch } from '../../../api/api-matches';
import { addMatchTheme } from '../../../assets/styles/theme';
import { TextField, ThemeProvider } from '@mui/material';
import Button from '../../button/Button';

interface IAddMatchProps {
    isModalOpen: boolean;
    toggleModal: (modalState: boolean) => void;
    refreshMatchList(shouldRefresh: boolean): void;
}

interface Team {
    _id: string;
    name: string;
}

interface Player {
    _id: string;
    name: string;
}

const AddMatch: React.FC<IAddMatchProps> = ({ isModalOpen, toggleModal, refreshMatchList }) => {
    const [teams, setTeams] = useState<Team[]>([]);
    const [homeTeam, setHomeTeam] = useState<string>('');
    const [awayTeam, setAwayTeam] = useState<string>('');
    const [homeScore, setHomeScore] = useState<number | string>(0);
    const [awayScore, setAwayScore] = useState<number | string>(0);
    const [gameType, setGameType] = useState<string>('');
    const [homePlayers, setHomePlayers] = useState<Player[]>([]);
    const [awayPlayers, setAwayPlayers] = useState<Player[]>([]);
    const [selectedHomePlayers, setSelectedHomePlayers] = useState<string[]>([]);
    const [selectedAwayPlayers, setSelectedAwayPlayers] = useState<string[]>([]);

    // Pobieranie drużyn
    useEffect(() => {
        const fetchAllTeams = async () => {
            try {
                const response = await fetchTeams();
                setTeams(response);
            } catch (error) {
                console.error('Nie udało się pobrać drużyn', error);
            }
        };

        fetchAllTeams();
    }, []);

    const getTeamName = (teamId: string) => {
        const team = teams.find(t => t._id === teamId);
        return team ? team.name : '';
    };

    // Pobieranie graczy dla wybranych drużyn
    useEffect(() => {
        const fetchPlayers = async (teamId: string) => {
            try {
                const response = await fetchPlayersByTeam(teamId);
                return response;
            } catch (error) {
                console.error('Nie udało się pobrać graczy', error);
                return [];
            }
        };

        if (homeTeam) {
            fetchPlayers(homeTeam).then(data => setHomePlayers(data));
            setSelectedHomePlayers([]); // Resetowanie wybranych graczy przy zmianie drużyny
        }
        if (awayTeam) {
            fetchPlayers(awayTeam).then(data => setAwayPlayers(data));
            setSelectedAwayPlayers([]); // Resetowanie wybranych graczy przy zmianie drużyny
        }
    }, [homeTeam, awayTeam]);

    const clearForm = () => {
        setHomeTeam('');
        setAwayTeam('');
        setHomeScore(0);
        setAwayScore(0);
        setHomePlayers([]);
        setAwayPlayers([]);
        setSelectedHomePlayers([]);
        setSelectedAwayPlayers([]);
    };

    const gameTypeOptions = [{ type: 'TDM' }, { type: 'CTF' }];

    // Funkcja do dodawania meczu
    const handleAddMatch = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!homeTeam || !awayTeam || homeTeam === awayTeam) {
            alert('Wybierz różne drużyny');
            return;
        }

        if (selectedHomePlayers.length === 0 || selectedAwayPlayers.length === 0) {
            alert('Wybierz graczy dla obu drużyn');
            return;
        }

        try {
            await addMatch(
                homeTeam,
                awayTeam,
                homeScore,
                awayScore,
                gameType,
                selectedHomePlayers,
                selectedAwayPlayers
            );

            alert('Mecz został dodany!');
            // Resetowanie formularza
            clearForm();
            refreshMatchList(true);
        } catch (error) {
            console.error('Nie udało się dodać meczu', error);
        }
    };

    const handleCancel = () => {
        clearForm();
        toggleModal(false);
    };

    // Zarządzanie wyborem graczy
    const handlePlayerSelection = (team: string, playerName: string, selected: boolean) => {
        if (team === 'home') {
            if (selected) {
                setSelectedHomePlayers(prev => [...prev, playerName]);
            } else {
                setSelectedHomePlayers(prev => prev.filter(name => name !== playerName));
            }
        } else if (team === 'away') {
            if (selected) {
                setSelectedAwayPlayers(prev => [...prev, playerName]);
            } else {
                setSelectedAwayPlayers(prev => prev.filter(name => name !== playerName));
            }
        }
    };

    return (
        <ModalComponent modalIsOpen={isModalOpen} closeModal={toggleModal}>
            <div className={styles.container}>
                <form className={styles.containerForm} onSubmit={handleAddMatch}>
                    <h2>Dodaj nowy mecz</h2>
                    <div className={styles.containerWrapper}>
                        <label className={styles.containerLabel}>Drużyna #1</label>
                        <select
                            className={styles.containerSelect}
                            value={homeTeam}
                            onChange={e => setHomeTeam(e.target.value)}
                            required>
                            <option value="">Wybierz drużynę</option>
                            {teams
                                ?.filter(team => team.name !== awayTeam)
                                .map(team => (
                                    <option key={team._id} value={team._id}>
                                        {team.name}
                                    </option>
                                ))}
                        </select>
                    </div>
                    <div className={styles.containerWrapper}>
                        <label className={styles.containerLabel}>Drużyna #2</label>
                        <select
                            className={styles.containerSelect}
                            value={awayTeam}
                            onChange={e => setAwayTeam(e.target.value)}
                            required>
                            <option value="">Wybierz drużynę</option>
                            {teams
                                ?.filter(team => team.name !== homeTeam)
                                .map(team => (
                                    <option key={team._id} value={team._id}>
                                        {team.name}
                                    </option>
                                ))}
                        </select>
                    </div>
                    <div className={styles.containerWrapper}>
                        <label className={styles.containerLabel}>Co było grane</label>
                        <select
                            className={styles.containerSelect}
                            value={gameType}
                            onChange={e => setGameType(e.target.value)}
                            required>
                            <option value="">Wybierz typ rozgrywki</option>
                            {gameTypeOptions
                                .filter(type => type.type !== gameType)
                                .map(type => (
                                    <option key={type.type} value={type.type}>
                                        {type.type}
                                    </option>
                                ))}
                            <option value="TDM">TDM</option>
                            <option value="CTF">CTF</option>
                        </select>
                    </div>
                    <div className={styles.containerWrapper}>
                        <label className={styles.containerLabel}>Wynik {getTeamName(homeTeam)}</label>
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
                        <label className={styles.containerLabel}>Wynik {getTeamName(awayTeam)}</label>
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
                                    Wybierz graczy <br /> {getTeamName(homeTeam)}
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
                                    Wybierz graczy <br /> {getTeamName(awayTeam)}
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
                        <Button label={'Dodaj mecz'} type={'submit'} />
                        <Button label={'Anuluj'} onClick={handleCancel} />
                    </div>
                </form>
            </div>
        </ModalComponent>
    );
};

export default AddMatch;
