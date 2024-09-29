import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from '../src/components/homepage/HomePage';
import TeamPage from '../src/components/teams/team-page/TeamPage';

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/team/:teamId" element={<TeamPage />} />
            </Routes>
        </Router>
    );
};

export default App;
