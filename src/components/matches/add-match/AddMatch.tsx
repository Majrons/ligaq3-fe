// AddMatch.tsx
import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../api/axiosConfig';
import ModalComponent from '../../modal/ModalComponent';

interface IAddMatchProps {
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
}

const AddMatch: React.FC<IAddMatchProps> = ({ isModalOpen, toggleModal }) => {
    const [teams, setTeams] = useState<Team[]>([]);
    const [homeTeam, setHomeTeam] = useState<string>('');
    const [awayTeam, setAwayTeam] = useState<string>('');
    const [homeScore, setHomeScore] = useState<number | ''>('');
    const [awayScore, setAwayScore] = useState<number | ''>('');
    const [homeTeamPlayers, setHomeTeamPlayers] = useState<string[]>([]);
    const [awayTeamPlayers, setAwayTeamPlayers] = useState<string[]>([]);
    const [homePlayers, setHomePlayers] = useState<Player[]>([]);
    const [awayPlayers, setAwayPlayers] = useState<Player[]>([]);

    // Pobieranie drużyn
    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const response = await axiosInstance.get('/teams');
                setTeams(response.data);
            } catch (error) {
                console.error('Nie udało się pobrać drużyn', error);
            }
        };

        fetchTeams();
    }, []);

    // Pobierz graczy dla wybranej drużyny domowej
    useEffect(() => {
        const fetchPlayers = async (teamId: string) => {
            try {
                const response = await axiosInstance.get(`/players/team/${teamId}`);
                return response.data;
            } catch (error) {
                console.error('Nie udało się pobrać graczy', error);
                return [];
            }
        };

        if (homeTeam) {
            fetchPlayers(homeTeam).then(data => setHomePlayers(data));
        }
        if (awayTeam) {
            fetchPlayers(awayTeam).then(data => setAwayPlayers(data));
        }
    }, [homeTeam, awayTeam]);

    // Funkcja do dodawania meczu
    const addMatch = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!homeTeam || !awayTeam || homeTeam === awayTeam) {
            alert('Wybierz różne drużyny');
            return;
        }

        if (homeTeamPlayers.length === 0 || awayTeamPlayers.length === 0) {
            alert('Wybierz graczy dla obu drużyn');
            return;
        }

        try {
            await axiosInstance.post('/matches', {
                homeTeam,
                awayTeam,
                homeScore: Number(homeScore),
                awayScore: Number(awayScore),
                homeTeamPlayers,
                awayTeamPlayers,
            });

            alert('Mecz został dodany!');
            // Resetowanie formularza
            setHomeTeam('');
            setAwayTeam('');
            setHomeScore('');
            setAwayScore('');
            setHomeTeamPlayers([]);
            setAwayTeamPlayers([]);
            setHomePlayers([]);
            setAwayPlayers([]);
        } catch (error) {
            console.error('Nie udało się dodać meczu', error);
        }
    };

    const handlePlayerSelection = (team: string, playerId: string, selected: boolean) => {
        if (team === 'home') {
            setHomeTeamPlayers(prev => (selected ? [...prev, playerId] : prev.filter(id => id !== playerId)));
        } else if (team === 'away') {
            setAwayTeamPlayers(prev => (selected ? [...prev, playerId] : prev.filter(id => id !== playerId)));
        }
    };

    const homeTeamName = teams.find(t => t._id === homeTeam)?.name;
    const awayTeamName = teams.find(t => t._id === awayTeam)?.name;

    return (
        <ModalComponent modalIsOpen={isModalOpen} closeModal={toggleModal}>
            <form onSubmit={addMatch}>
                <h2>Dodaj nowy mecz</h2>
                <div>
                    <label>Drużyna #1</label>
                    <select value={homeTeam} onChange={e => setHomeTeam(e.target.value)} required>
                        <option value="">Wybierz drużynę</option>
                        {teams.map(team => (
                            <option key={team._id} value={team._id}>
                                {team.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Drużyna #2</label>
                    <select value={awayTeam} onChange={e => setAwayTeam(e.target.value)} required>
                        <option value="">Wybierz drużynę</option>
                        {teams.map(team => (
                            <option key={team._id} value={team._id}>
                                {team.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Wynik {homeTeamName}</label>
                    <input
                        type="number"
                        value={homeScore}
                        onChange={e => setHomeScore(e.target.value ? Number(e.target.value) : '')}
                        required
                    />
                </div>
                <div>
                    <label>Wynik {awayTeamName}</label>
                    <input
                        type="number"
                        value={awayScore}
                        onChange={e => setAwayScore(e.target.value ? Number(e.target.value) : '')}
                        required
                    />
                </div>

                {/* Wybór graczy dla drużyny domowej */}
                {homeTeam && (
                    <div>
                        <h3>Wybierz graczy dla {teams.find(t => t._id === homeTeam)?.name}</h3>
                        {homePlayers.map(player => (
                            <div key={player._id}>
                                <input
                                    type="checkbox"
                                    id={`home-${player._id}`}
                                    onChange={e => handlePlayerSelection('home', player._id, e.target.checked)}
                                />
                                <label htmlFor={`home-${player._id}`}>{player.name}</label>
                            </div>
                        ))}
                    </div>
                )}

                {/* Wybór graczy dla drużyny wyjazdowej */}
                {awayTeam && (
                    <div>
                        <h3>Wybierz graczy dla {teams.find(t => t._id === awayTeam)?.name}</h3>
                        {awayPlayers.map(player => (
                            <div key={player._id}>
                                <input
                                    type="checkbox"
                                    id={`away-${player._id}`}
                                    onChange={e => handlePlayerSelection('away', player._id, e.target.checked)}
                                />
                                <label htmlFor={`away-${player._id}`}>{player.name}</label>
                            </div>
                        ))}
                    </div>
                )}

                <div>
                    <button type="submit">Dodaj mecz</button>
                    <button type="button" onClick={() => toggleModal(false)}>
                        Anuluj
                    </button>
                </div>
            </form>
        </ModalComponent>
    );
};

export default AddMatch;
