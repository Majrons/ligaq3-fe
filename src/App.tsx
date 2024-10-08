import React from 'react';
import styles from './App.module.scss';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from '../src/components/homepage/HomePage';
import TeamPage from '../src/components/teams/team-page/TeamPage';
import classnames from 'classnames';
import Menu from '../src/components/menu/Menu';
import TeamsPage from './components/teams/teams-page/TeamsPage';

const App: React.FC = () => {
    return (
        <div className={classnames('grid', styles.container)}>
            <Router>
                <Menu />
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/team/:teamId" element={<TeamPage />} />
                    <Route path="/teams" element={<TeamsPage />} />
                </Routes>
            </Router>
        </div>
    );
};

export default App;
