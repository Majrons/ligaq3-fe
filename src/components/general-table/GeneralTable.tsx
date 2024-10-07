import React from 'react';
import styles from './GeneralTable.module.scss';
import { useNavigate } from 'react-router-dom';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    styled,
    tableCellClasses,
} from '@mui/material';

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
    const navigate = useNavigate();

    const goToTeamPage = (teamId: string) => {
        navigate(`/team/${teamId}`);
    };

    const totalMatchesPlayed = teams.reduce((acc, team) => acc + team.matchesPlayed, 0);
    const averageMatchesPlayed = totalMatchesPlayed / teams.length;
    const requiredMatches = averageMatchesPlayed * 0.7;

    const sortedTeams = [...teams].sort((a, b) => {
        const winPercentageA = a.matchesPlayed ? a.wins / a.matchesPlayed : 0;
        const winPercentageB = b.matchesPlayed ? b.wins / b.matchesPlayed : 0;

        const aEligible = a.matchesPlayed >= requiredMatches;
        const bEligible = b.matchesPlayed >= requiredMatches;

        if (aEligible && !bEligible) return -1;
        if (!aEligible && bEligible) return 1;

        if (winPercentageA !== winPercentageB) {
            return winPercentageB - winPercentageA;
        }

        return b.wins - a.wins;
    });

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: theme.palette.common.black,
            color: theme.palette.common.white,
            borderBottom: `1px solid rgb(0, 0, 0)`,
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 16,
            borderBottom: `1px solid rgb(0, 0, 0)`,
            color: 'rgb(255, 255, 255)',
        },
    }));

    const StyledTableRow = styled(TableRow)(() => ({
        '&:nth-of-type(odd)': {
            backgroundColor: 'rgba(48, 48, 48, 1)',
        },
        '&:nth-of-type(even)': {
            backgroundColor: 'rgba(30, 30, 30, 1)',
        },
        // hide last border
        '&:last-child td, &:last-child th': {
            border: 0,
        },
    }));

    return (
        <div className={styles.resultTable}>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="Liga Q3">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>#</StyledTableCell>
                            <StyledTableCell component="th" scope="row">
                                Drużyna
                            </StyledTableCell>
                            <StyledTableCell align="center">Wygrane</StyledTableCell>
                            <StyledTableCell align="center">Przegrane</StyledTableCell>
                            <StyledTableCell align="center">Mecze</StyledTableCell>
                            <StyledTableCell align="right">% Wygranych</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedTeams.map((team, index) => (
                            <StyledTableRow key={team._id}>
                                <StyledTableCell>{index + 1}</StyledTableCell>
                                <StyledTableCell
                                    component="th"
                                    scope="row"
                                    onClick={() => goToTeamPage(team._id)}
                                    style={{
                                        cursor: 'pointer',
                                        color: 'white',
                                        textDecoration: 'underline',
                                        fontWeight: 'bold',
                                    }}>
                                    {team.name}
                                </StyledTableCell>
                                <StyledTableCell align="center">{team.wins}</StyledTableCell>
                                <StyledTableCell align="center">{team.losses}</StyledTableCell>
                                <StyledTableCell align="center">{team.matchesPlayed}</StyledTableCell>
                                <StyledTableCell align="right">
                                    {((team.wins / team.matchesPlayed) * 100).toFixed(2)}%
                                </StyledTableCell>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default GeneralTable;
