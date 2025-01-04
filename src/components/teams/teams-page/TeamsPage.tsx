import React, { useEffect, useState } from 'react';
import styles from './TeamsPage.module.scss';
import { fetchTeam, fetchTeams } from '../../../api/api-teams';
import { fetchPlayersByTeam } from '../../../api/api-players';

interface ITeamsProps {
    _id: string;
    name: string;
    wins: number;
    matchesPlayed: number;
    losses: number;
}

interface Player {
    _id: string;
    name: string;
}

interface ITeamDetails extends ITeamsProps {
    players: Player[];
}

interface ITeamsPageProps {
    teamsArray?: ITeamDetails[];
}

const TeamsPage: React.FC<ITeamsPageProps> = ({ teamsArray }) => {
    const [teams, setTeams] = useState<ITeamDetails[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchTeamsWithDetails = async () => {
            setIsLoading(true);
            try {
                // Pobranie podstawowej listy drużyn
                const teamList: ITeamsProps[] = await fetchTeams();

                // Pobranie szczegółów każdej drużyny oraz listy graczy
                const detailedTeams = await Promise.all(
                    teamList.map(async team => {
                        const teamDetails = await fetchTeam(team._id);
                        const playerData = await fetchPlayersByTeam(team._id);

                        return {
                            ...team,
                            ...teamDetails,
                            players: playerData, // Lista graczy przypisana do drużyny
                        };
                    })
                );

                setTeams(detailedTeams);
            } catch (error) {
                console.error('Nie udało się pobrać danych zespołów:', error);
            } finally {
                setIsLoading(false);
            }
        };

        teamsArray ? setTeams(teamsArray) : fetchTeamsWithDetails();
    }, []);

    return (
        <div className={styles.container}>
            {isLoading && <p>Ładowanie zespołów...</p>}
            {!isLoading && teams.length > 0
                ? teams.map(team => (
                      <div key={team._id} className={styles.teamCard}>
                          <h2>{team.name}</h2>
                          <p>Zwycięstwa: {team.wins}</p>
                          <p>Rozegrane mecze: {team.matchesPlayed}</p>
                          <p>Przegrane: {team.losses}</p>
                          <h4>Gracze:</h4>
                          <ul>
                              {team.players.map(player => (
                                  <li key={player._id}>{player.name}</li>
                              ))}
                          </ul>
                      </div>
                  ))
                : !isLoading && <p>Brak zespołów do wyświetlenia</p>}
        </div>
    );
};

export default TeamsPage;
