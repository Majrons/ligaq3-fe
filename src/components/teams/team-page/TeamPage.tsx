// TeamPage.tsx
import React, { useEffect, useState } from 'react';
import styles from './TeamPage.module.scss';
import { fetchTeam, updateTeam, deleteTeam } from '../../../api/api-teams';
import { fetchPlayersByTeam, addPlayerToTeam, deletePlayer } from '../../../api/api-players';
import { fetchMatchesByTeam } from '../../../api/api-matches';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../../button/Button';
import addTeamtheme from '../../../assets/styles/theme';
import { TextField, ThemeProvider } from '@mui/material';
import { jwtDecode } from 'jwt-decode';
import { Role, TokenPayload } from '../../homepage/HomePage';
import classnames from 'classnames';

interface Player {
    _id: string;
    name: string;
}

interface Match {
    _id: string;
    homeTeam: { _id: string; name: string };
    awayTeam: { _id: string; name: string };
    homeScore: number;
    awayScore: number;
    date: string;
}

const TeamPage: React.FC = () => {
    const { teamId } = useParams<{ teamId: string }>();
    const navigate = useNavigate();
    const [players, setPlayers] = useState<Player[]>([]);
    const [matches, setMatches] = useState<Match[]>([]);
    const [teamName, setTeamName] = useState<string>('');
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [showAddPlayerForm, setShowAddPlayerForm] = useState<boolean>(false);
    const [newPlayer, setNewPlayer] = useState({ name: '' });
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [editedTeamName, setEditedTeamName] = useState<string>('');
    const [role, setRole] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decoded: TokenPayload = jwtDecode(token);
            setRole(decoded.role);
            setIsLoggedIn(true);
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const teamData = await fetchTeam(teamId!);
                setTeamName(teamData.name);

                const playerData = await fetchPlayersByTeam(teamId!);
                setPlayers(playerData);

                const matchData = await fetchMatchesByTeam(teamId!);
                setMatches(matchData);
            } catch (error) {
                console.error('Nie udało się pobrać danych', error);
            }
        };

        fetchData();
    }, [teamId]);

    const handleAddPlayer = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const newPlayerData = await addPlayerToTeam(newPlayer.name, teamId!);
            setPlayers([...players, newPlayerData]);
            setNewPlayer({ name: '' });
            setShowAddPlayerForm(false);
        } catch (error) {
            console.error('Nie udało się dodać gracza', error);
        }
    };

    const handleDeletePlayer = async (playerId: string) => {
        try {
            await deletePlayer(playerId);
            setPlayers(players.filter(player => player._id !== playerId));
        } catch (error) {
            console.error('Nie udało się usunąć gracza', error);
        }
    };

    const handleUpdateTeamName = async () => {
        try {
            const updatedTeam = await updateTeam(teamId || '', editedTeamName);
            setTeamName(updatedTeam.name);
            setIsEditing(false);
        } catch (error) {
            console.error('Nie udało się zaktualizować nazwy drużyny', error);
        }
    };

    const handleDeleteTeam = async () => {
        try {
            await deleteTeam(teamId || '');
            navigate('/teams');
        } catch (error) {
            console.error('Nie udało się usunąć drużyny', error);
        }
    };

    const handleEditTeamName = () => {
        setIsEditing(true);
        setEditedTeamName(teamName);
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.containerTitle}>{teamName}</h1>
            {isEditing ? (
                <>
                    <ThemeProvider theme={addTeamtheme}>
                        <div className={styles.containerInput}>
                            <TextField
                                id="outlined-basic"
                                variant="outlined"
                                className={styles.addTeamInput}
                                label="Wpisz nazwę"
                                onChange={e => setEditedTeamName(e.target.value)}
                                value={editedTeamName}
                            />
                        </div>
                    </ThemeProvider>
                    <div className={styles.containerButtons}>
                        <Button label={'Zapisz'} onClick={handleUpdateTeamName} />
                        <Button label={'Anuluj'} onClick={() => setIsEditing(false)} />
                    </div>
                </>
            ) : (
                isLoggedIn &&
                role === Role.ADMIN && (
                    <div className={styles.containerButtons}>
                        <Button label={'Edytuj nazwę'} onClick={handleEditTeamName} />
                        <Button label={'Usuń drużynę'} onClick={handleDeleteTeam} />
                    </div>
                )
            )}

            <h2 className={styles.containerPlayersListTitle}>Lista graczy</h2>
            <ul className={styles.containerPlayersList}>
                {players.map(player => (
                    <li
                        className={classnames(styles.containerPlayersListItem, {
                            [styles.containerPlayersListItemAdmin]: role === Role.ADMIN,
                        })}
                        key={player._id}>
                        {player.name}
                        {isLoggedIn && role === Role.ADMIN && (
                            <Button
                                classes={styles.containerPlayersListItemBtn}
                                label={'Usuń'}
                                onClick={() => handleDeletePlayer(player._id)}
                            />
                        )}
                    </li>
                ))}
            </ul>

            {isLoggedIn && role === Role.ADMIN && (
                <>
                    <Button
                        label={showAddPlayerForm ? 'Anuluj' : 'Dodaj gracza'}
                        onClick={() => setShowAddPlayerForm(!showAddPlayerForm)}
                    />
                    {showAddPlayerForm && (
                        <form className={styles.containerForm} onSubmit={handleAddPlayer}>
                            <ThemeProvider theme={addTeamtheme}>
                                <div className={styles.containerInput}>
                                    <TextField
                                        id="outlined-basic"
                                        variant="outlined"
                                        className={styles.addTeamInput}
                                        label="Imię gracza"
                                        onChange={e => setNewPlayer({ name: e.target.value })}
                                        value={newPlayer.name}
                                        required
                                    />
                                </div>
                            </ThemeProvider>
                            <Button label={'Dodaj gracza'} type={'submit'} />
                        </form>
                    )}
                </>
            )}

            <h2 className={styles.containerMatchesListTitle}>Wyniki meczów</h2>
            <ul className={styles.containerMatchesList}>
                {matches.map(match => (
                    <li className={styles.containerMatchesListItem} key={match._id}>
                        <div>Data: {new Date(match.date).toLocaleDateString()}</div>
                        <div className={styles.containerMatchesListItemDetails}>
                            <div>{match.homeTeam.name}</div>
                            <div>{match.homeScore}</div> : <div>{match.awayScore}</div>
                            <div>{match.awayTeam.name}</div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TeamPage;
