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
    const [screenshot1, setScreenshot1] = useState<File | null>(null);
    const [screenshot2, setScreenshot2] = useState<File | null>(null);

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
        setGameType('');
        setHomePlayers([]);
        setAwayPlayers([]);
        setSelectedHomePlayers([]);
        setSelectedAwayPlayers([]);
        setScreenshot1(null);
        setScreenshot2(null);
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

        const formData = new FormData();
        formData.append('homeTeam', homeTeam);
        formData.append('awayTeam', awayTeam);
        formData.append('homeScore', String(homeScore));
        formData.append('awayScore', String(awayScore));
        formData.append('gameType', gameType);
        formData.append('homePlayers', JSON.stringify(selectedHomePlayers));
        formData.append('awayPlayers', JSON.stringify(selectedAwayPlayers));
        if (screenshot1) formData.append('screenshot1', screenshot1);
        if (screenshot2) formData.append('screenshot2', screenshot2);

        try {
            await addMatch(formData);
            alert('Mecz został dodany!');
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

    const handlePlayerSelection = (team: string, playerId: string, selected: boolean) => {
        if (team === 'home') {
            setSelectedHomePlayers(prev => (selected ? [...prev, playerId] : prev.filter(id => id !== playerId)));
        } else if (team === 'away') {
            setSelectedAwayPlayers(prev => (selected ? [...prev, playerId] : prev.filter(id => id !== playerId)));
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
                                .filter(team => team._id !== awayTeam)
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
                                .filter(team => team._id !== homeTeam)
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
                            {gameTypeOptions.map(type => (
                                <option key={type.type} value={type.type}>
                                    {type.type}
                                </option>
                            ))}
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
                                <h3>Wybierz graczy {getTeamName(homeTeam)}</h3>
                                {homePlayers?.map(player => (
                                    <div key={player._id}>
                                        <input
                                            type="checkbox"
                                            checked={selectedHomePlayers.includes(player._id)}
                                            onChange={e => handlePlayerSelection('home', player._id, e.target.checked)}
                                        />
                                        <label>{player.name}</label>
                                    </div>
                                ))}
                            </div>
                        )}
                        {awayTeam && (
                            <div>
                                <h3>Wybierz graczy {getTeamName(awayTeam)}</h3>
                                {awayPlayers?.map(player => (
                                    <div key={player._id}>
                                        <input
                                            type="checkbox"
                                            checked={selectedAwayPlayers.includes(player._id)}
                                            onChange={e => handlePlayerSelection('away', player._id, e.target.checked)}
                                        />
                                        <label>{player.name}</label>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className={styles.containerWrapper}>
                        <label className={styles.containerLabel}>Screenshot #1</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={e => {
                                if (e.target.files && e.target.files[0]) {
                                    setScreenshot1(e.target.files[0]);
                                } else {
                                    setScreenshot1(null);
                                }
                            }}
                        />
                    </div>
                    <div className={styles.containerWrapper}>
                        <label className={styles.containerLabel}>Screenshot #2</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={e => {
                                if (e.target.files && e.target.files[0]) {
                                    setScreenshot2(e.target.files[0]);
                                } else {
                                    setScreenshot2(null);
                                }
                            }}
                        />
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
