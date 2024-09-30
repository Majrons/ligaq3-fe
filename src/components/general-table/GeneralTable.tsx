import React from 'react';
import { useNavigate } from 'react-router-dom';

interface Team {
    _id: string;
    name: string;
    losses: number;
    wins: number;
    matchesPlayed: number;
}

interface IGeneralTableProps {
    teams: Team[];
}

const GeneralTable: React.FC<IGeneralTableProps> = ({ teams }) => {
    const navigate = useNavigate(); // Użycie useNavigate zamiast useHistory

    const goToTeamPage = (teamId: string) => {
        navigate(`/team/${teamId}`); // Zamiast history.push używamy navigate
    };

    const sortedTeams = [...teams].sort((a, b) => {
        const winPercentageA = a.matchesPlayed ? a.wins / a.matchesPlayed : 0;
        const winPercentageB = b.matchesPlayed ? b.wins / b.matchesPlayed : 0;
        return winPercentageB - winPercentageA;
    });

    return (
        <table className="results-table">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Drużyna</th>
                    <th>Wygrane</th>
                    <th>Przegrane</th>
                    <th>Mecze</th>
                    <th>% Wygranych</th>
                </tr>
            </thead>
            <tbody>
                {sortedTeams.map((team, index) => (
                    <tr key={team._id}>
                        <td>{index + 1}</td>
                        <td
                            onClick={() => goToTeamPage(team._id)}
                            style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}>
                            {team.name}
                        </td>
                        <td>{team.wins}</td>
                        <td>{team.losses}</td>
                        <td>{team.matchesPlayed}</td>
                        <td>{((team.wins / team.matchesPlayed) * 100).toFixed(2)}%</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default GeneralTable;
