import React from 'react';
import styles from './App.module.scss';
import { jwtDecode } from 'jwt-decode';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from '../src/components/homepage/HomePage';
import TeamPage from '../src/components/teams/team-page/TeamPage';
import classnames from 'classnames';
import Menu from '../src/components/menu/Menu';
import TeamsPage from './components/teams/teams-page/TeamsPage';

const App: React.FC = () => {
    const checkTokenExpiration = () => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = jwtDecode(token);

            if (decodedToken && decodedToken.exp && decodedToken.exp * 1000 < Date.now()) {
                alert('Sesja wygasła, zaloguj się ponownie.');
                localStorage.removeItem('token');
                window.location.href = '/';
            }
        }
    };

    React.useEffect(() => {
        const interval = setInterval(() => {
            checkTokenExpiration();
        }, 60000 * 10); // Sprawdzanie co minutę

        return () => clearInterval(interval);
    }, []);

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
