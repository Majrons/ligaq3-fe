import React from 'react';
import styles from './App.module.scss';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from '../src/components/homepage/HomePage';
import TeamPage from '../src/components/teams/team-page/TeamPage';
import classnames from 'classnames';

const App: React.FC = () => {
    return (
        <div className={classnames('grid', styles.container)}>
            <Router>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/team/:teamId" element={<TeamPage />} />
                </Routes>
            </Router>
        </div>
    );
};

export default App;
