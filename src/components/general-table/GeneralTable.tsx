// src/components/ResultsTable.tsx
import React from 'react';
import styles from './GeneralTable.module.scss';

interface Team {
    _id: string;
    name: string;
    wins: number;
    losses: number;
    matchesPlayed: number;
}

interface ResultsTableProps {
    teams: Team[];
}

const GeneralTable: React.FC<ResultsTableProps> = ({ teams }) => {
    const sortedTeams = [...teams].sort((a, b) => {
        const winPercentageA = a.matchesPlayed ? a.wins / a.matchesPlayed : 0;
        const winPercentageB = b.matchesPlayed ? b.wins / b.matchesPlayed : 0;
        return winPercentageB - winPercentageA;
    });

    return (
        <table className={styles.resultsTable}>
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
                        <td>{team.name}</td>
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
