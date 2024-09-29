import React from 'react';
import styles from './AddTeam.module.scss';

const AddTeam: React.FC = () => {
    return (
        <div className={styles.addTeam}>
            <h2>Dodaj Drużynę</h2>
            <form>
                <label>
                    Nazwa Drużyny:
                    <input type="text" placeholder="Wprowadź nazwę drużyny" />
                </label>
                <button type="submit">Dodaj Drużynę</button>
            </form>
        </div>
    );
};

export default AddTeam;
