import React, { useState, useEffect } from 'react';
import ModalComponent from '../../modal/ModalComponent';
import { fetchPlayersByTeam } from '../../../api/api-players';
import { fetchTeams } from '../../../api/api-teams';
import { fetchMatch, updateMatch } from '../../../api/api-matches';

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
    teamId: string; // Dodano właściwość teamId
}

const EditMatch: React.FC<IEditMatchProps> = ({ matchId, isModalOpen, toggleModal }) => {
    const [teams, setTeams] = useState<Team[]>([]);
    const [players, setPlayers] = useState<Player[]>([]);
    const [homeTeam, setHomeTeam] = useState<string>('');
    const [awayTeam, setAwayTeam] = useState<string>('');
    const [homePlayers, setHomePlayers] = useState<string[]>([]);
    const [awayPlayers, setAwayPlayers] = useState<string[]>([]);
    const [homeScore, setHomeScore] = useState<number>(0);
    const [awayScore, setAwayScore] = useState<number>(0);

    // Pobieranie dostępnych drużyn i graczy
    useEffect(() => {
        const fetchTeamsAndPlayers = async () => {
            try {
                const teamResponse = await fetchTeams();
                setTeams(teamResponse.data);

                const playerResponse = await fetchPlayersByTeam(teamResponse.data.id);
                setPlayers(playerResponse.data);
            } catch (error) {
                console.error('Nie udało się pobrać drużyn lub graczy', error);
            }
        };

        fetchTeamsAndPlayers();
    }, []);

    // Pobieranie danych meczu
    useEffect(() => {
        const handleFetchMatch = async () => {
            try {
                const response = await fetchMatch(matchId);
                const { homeTeam, awayTeam, homeScore, awayScore, players: matchPlayers } = response.data;

                setHomeTeam(homeTeam);
                setAwayTeam(awayTeam);
                setHomeScore(homeScore);
                setAwayScore(awayScore);
                setHomePlayers(matchPlayers?.homePlayers || []);
                setAwayPlayers(matchPlayers?.awayPlayers || []);
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
            await updateMatch(matchId, homeTeam, awayTeam, homeScore, awayScore, homePlayers, awayPlayers);

            alert('Mecz został zaktualizowany!');
            toggleModal(false);
        } catch (error) {
            console.error('Nie udało się zaktualizować meczu', error);
        }
    };

    return (
        <ModalComponent modalIsOpen={isModalOpen} closeModal={toggleModal}>
            <form onSubmit={handleUpdateMatch}>
                <h2>Edytuj mecz</h2>
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
                    <label>Gracze drużyny #1</label>
                    <select
                        multiple
                        value={homePlayers}
                        onChange={e => setHomePlayers(Array.from(e.target.selectedOptions, option => option.value))}>
                        {players
                            .filter(player => player.teamId === homeTeam)
                            .map(player => (
                                <option key={player._id} value={player._id}>
                                    {player.name}
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
                    <label>Gracze drużyny #2</label>
                    <select
                        multiple
                        value={awayPlayers}
                        onChange={e => setAwayPlayers(Array.from(e.target.selectedOptions, option => option.value))}>
                        {players
                            .filter(player => player.teamId === awayTeam)
                            .map(player => (
                                <option key={player._id} value={player._id}>
                                    {player.name}
                                </option>
                            ))}
                    </select>
                </div>
                <div>
                    <label>Wynik {homeTeam}</label>
                    <input
                        type="number"
                        value={homeScore}
                        onChange={e => setHomeScore(e.target.value ? Number(e.target.value) : 0)}
                        required
                    />
                </div>
                <div>
                    <label>Wynik {awayTeam}</label>
                    <input
                        type="number"
                        value={awayScore}
                        onChange={e => setAwayScore(e.target.value ? Number(e.target.value) : 0)}
                        required
                    />
                </div>
                <div>
                    <button type="submit">Zaktualizuj mecz</button>
                    <button onClick={() => toggleModal(false)}>Anuluj</button>
                </div>
            </form>
        </ModalComponent>
    );
};

export default EditMatch;
