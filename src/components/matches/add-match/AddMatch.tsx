import React, { useState, useEffect } from 'react';
import styles from './AddMatch.module.scss';
import ModalComponent from '../../modal/ModalComponent';
import { fetchPlayersByTeam } from '../../../api/api-players';
import { fetchTeams } from '../../../api/api-teams';
import { addMatch } from '../../../api/api-matches';

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
    const [homeScore, setHomeScore] = useState<number>(0);
    const [awayScore, setAwayScore] = useState<number>(0);
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
            await addMatch(homeTeam, awayTeam, homeScore, awayScore, selectedHomePlayers, selectedAwayPlayers);

            alert('Mecz został dodany!');
            // Resetowanie formularza
            setHomeTeam('');
            setAwayTeam('');
            setHomeScore(0);
            setAwayScore(0);
            setHomePlayers([]);
            setAwayPlayers([]);
            setSelectedHomePlayers([]);
            setSelectedAwayPlayers([]);
        } catch (error) {
            console.error('Nie udało się dodać meczu', error);
        }
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
                <form onSubmit={handleAddMatch}>
                    <h2>Dodaj nowy mecz</h2>
                    <div>
                        <label>Drużyna #1</label>
                        <select value={homeTeam} onChange={e => setHomeTeam(e.target.value)} required>
                            <option value="">Wybierz drużynę</option>
                            {teams?.map(team => (
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
                            {teams?.map(team => (
                                <option key={team._id} value={team._id}>
                                    {team.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label>Wynik {getTeamName(homeTeam)}</label>
                        <input
                            type="number"
                            value={homeScore}
                            onChange={e => setHomeScore(e.target.value ? Number(e.target.value) : 0)}
                            required
                        />
                    </div>
                    <div>
                        <label>Wynik {getTeamName(awayTeam)}</label>
                        <input
                            type="number"
                            value={awayScore}
                            onChange={e => setAwayScore(e.target.value ? Number(e.target.value) : 0)}
                            required
                        />
                    </div>
                    <div className={styles.containerChoosePlayers}>
                        {homeTeam && (
                            <div>
                                <h3>Wybierz graczy dla {getTeamName(homeTeam)}</h3>
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
                                <h3>Wybierz graczy dla {getTeamName(awayTeam)}</h3>
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
                    <div>
                        <button type="submit">Dodaj mecz</button>
                        <button type="button" onClick={() => toggleModal(false)}>
                            Anuluj
                        </button>
                    </div>
                </form>
            </div>
        </ModalComponent>
    );
};

export default AddMatch;
