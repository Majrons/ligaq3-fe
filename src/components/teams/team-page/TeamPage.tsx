// TeamPage.tsx
import React, { useEffect, useState } from 'react';
import { fetchTeam, updateTeam, deleteTeam } from '../../../api/api-teams';
import { fetchPlayersByTeam, addPlayerToTeam, deletePlayer } from '../../../api/api-players';
import { fetchMatchesByTeam } from '../../../api/api-matches';
import { useParams, useNavigate } from 'react-router-dom';

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

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
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

    return (
        <div>
            <h1>
                Szczegóły drużyny:
                {isEditing ? (
                    <>
                        <input type="text" value={editedTeamName} onChange={e => setEditedTeamName(e.target.value)} />
                        <button onClick={handleUpdateTeamName}>Zapisz</button>
                        <button onClick={() => setIsEditing(false)}>Anuluj</button>
                    </>
                ) : (
                    <>
                        {teamName}
                        {isLoggedIn && (
                            <>
                                <button
                                    onClick={() => {
                                        setIsEditing(true);
                                        setEditedTeamName(teamName);
                                    }}>
                                    Edytuj nazwę
                                </button>
                                <button onClick={handleDeleteTeam}>Usuń drużynę</button>
                            </>
                        )}
                    </>
                )}
            </h1>

            <h2>Lista graczy</h2>
            <ul>
                {players.map(player => (
                    <li key={player._id}>
                        {player.name}
                        {isLoggedIn && <button onClick={() => handleDeletePlayer(player._id)}>Usuń</button>}
                    </li>
                ))}
            </ul>

            {isLoggedIn && (
                <>
                    <button onClick={() => setShowAddPlayerForm(!showAddPlayerForm)}>
                        {showAddPlayerForm ? 'Anuluj' : 'Dodaj gracza'}
                    </button>

                    {showAddPlayerForm && (
                        <form onSubmit={handleAddPlayer}>
                            <input
                                type="text"
                                placeholder="Imię gracza"
                                value={newPlayer.name}
                                onChange={e => setNewPlayer({ name: e.target.value })}
                                required
                            />
                            <button type="submit">Dodaj gracza</button>
                        </form>
                    )}
                </>
            )}

            <h2>Wyniki meczów</h2>
            <ul>
                {matches.map(match => (
                    <li key={match._id}>
                        {match.homeTeam.name} {match.homeScore} : {match.awayScore} {match.awayTeam.name}
                        <br /> Data: {new Date(match.date).toLocaleDateString()}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TeamPage;
