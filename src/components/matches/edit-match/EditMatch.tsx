import React, { useState, useEffect } from 'react';
import ModalComponent from '../../modal/ModalComponent';
import { fetchPlayersByTeam } from '../../../api/api-players';
import { fetchTeams } from '../../../api/api-teams';
import { fetchMatch, updateMatch } from '../../../api/api-matches';
import styles from './EditMatch.module.scss';
import { TextField, ThemeProvider } from '@mui/material';
import { addMatchTheme } from '../../../assets/styles/theme';
import Button from '../../button/Button';
import classnames from 'classnames';

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
    const [screenshot1, setScreenshot1] = useState<File | null>(null);
    const [screenshot2, setScreenshot2] = useState<File | null>(null);
    const [screenshot3, setScreenshot3] = useState<File | null>(null);

    // Pobieranie drużyn i danych meczu
    useEffect(() => {
        const fetchMatchData = async () => {
            try {
                const match = await fetchMatch(matchId);
                const {
                    homeTeam,
                    awayTeam,
                    homePlayers,
                    awayPlayers,
                    homeScore,
                    awayScore,
                    gameType,
                    screenshot1,
                    screenshot2,
                    screenshot3,
                } = match;

                setHomeTeamID(homeTeam._id);
                setHomeTeam(homeTeam.name);
                setAwayTeamID(awayTeam._id);
                setAwayTeam(awayTeam.name);
                setSelectedHomePlayers(homePlayers.map((p: Player) => p.name));
                setSelectedAwayPlayers(awayPlayers.map((p: Player) => p.name));
                setHomeScore(homeScore);
                setAwayScore(awayScore);
                setGameType(gameType);
                setScreenshot1(screenshot1);
                setScreenshot2(screenshot2);
                setScreenshot3(screenshot3);

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

        const formData = new FormData();
        formData.append('homeTeam', homeTeamID);
        formData.append('awayTeam', awayTeamID);
        formData.append('homeScore', String(homeScore));
        formData.append('awayScore', String(awayScore));
        formData.append('gameType', gameType);
        formData.append('homePlayers', JSON.stringify(selectedHomePlayers));
        formData.append('awayPlayers', JSON.stringify(selectedAwayPlayers));
        if (screenshot1) formData.append('screenshot1', screenshot1);
        if (screenshot2) formData.append('screenshot2', screenshot2);
        if (screenshot3) formData.append('screenshot2', screenshot3);

        try {
            await updateMatch(matchId, formData);
            alert('Mecz został zaktualizowany!');
            toggleModal(false);
            handleRefreshMatchList(true);
        } catch (error) {
            console.error('Nie udało się zaktualizować meczu', error);
        }
    };

    const handlePlayerSelection = (team: string, playerName: string, selected: boolean) => {
        if (team === 'home') {
            setSelectedHomePlayers(prev =>
                selected ? [...prev, playerName] : prev.filter(name => name !== playerName)
            );
        } else if (team === 'away') {
            setSelectedAwayPlayers(prev =>
                selected ? [...prev, playerName] : prev.filter(name => name !== playerName)
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
                            onChange={e => setHomeTeamID(e.target.value)}
                            required>
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
                            onChange={e => setAwayTeamID(e.target.value)}
                            required>
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
                        <div
                            className={classnames(
                                styles.containerChoosePlayersWrapper,
                                styles.containerChoosePlayersWrapperHome
                            )}>
                            <h3>Wybierz graczy {homeTeam}</h3>
                            {homePlayers.map(player => (
                                <div key={player._id}>
                                    <input
                                        type="checkbox"
                                        checked={selectedHomePlayers.includes(player.name)}
                                        onChange={e => handlePlayerSelection('home', player.name, e.target.checked)}
                                    />
                                    <label>{player.name}</label>
                                </div>
                            ))}
                        </div>
                        <div
                            className={classnames(
                                styles.containerChoosePlayersWrapper,
                                styles.containerChoosePlayersWrapperAway
                            )}>
                            <h3>Wybierz graczy {awayTeam}</h3>
                            {awayPlayers.map(player => (
                                <div key={player._id}>
                                    <input
                                        type="checkbox"
                                        checked={selectedAwayPlayers.includes(player.name)}
                                        onChange={e => handlePlayerSelection('away', player.name, e.target.checked)}
                                    />
                                    <label>{player.name}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className={styles.containerWrapper}>
                        <label className={styles.containerLabel}>Screenshot #1</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={e => setScreenshot1(e.target.files ? e.target.files[0] : screenshot1)}
                        />
                    </div>
                    <div className={styles.containerWrapper}>
                        <label className={styles.containerLabel}>Screenshot #2</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={e => setScreenshot2(e.target.files ? e.target.files[0] : screenshot2)}
                        />
                    </div>
                    <div className={styles.containerWrapper}>
                        <label className={styles.containerLabel}>Screenshot #3</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={e => setScreenshot3(e.target.files ? e.target.files[0] : screenshot3)}
                        />
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
