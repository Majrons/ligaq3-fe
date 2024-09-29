import React from 'react';
import styles from './App.module.scss';

import HomePage from '../src/components/homepage/HomePage';
import AddTeam from '../src/components/teams/add-team/AddTeam';
import classnames from 'classnames';
// import EditTeam from '@/components/teams/add-team/EditTeam';
// import ResultsTable from '@/components/general-table/ResultsTable';

const App: React.FC = () => {
    return (
        <div className={classnames('grid', styles.container)}>
            <header>
                <h1>Liga Rozgrywek Kwartalnych</h1>
            </header>

            <main>
                <HomePage />
                <AddTeam />
                {/*<EditTeam />*/}
                {/*<ResultsTable />*/}
            </main>
        </div>
    );
};

export default App;
