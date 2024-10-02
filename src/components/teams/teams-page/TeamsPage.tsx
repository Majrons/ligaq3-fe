import React from 'react';
import teamsImage from '../../../assets/images/teams.jpeg';
import styles from './TeamsPage.module.scss';

const TeamsPage: React.FC = () => (
    <div className={styles.container}>
        <img src={teamsImage} alt="teams" />
    </div>
);

export default TeamsPage;
