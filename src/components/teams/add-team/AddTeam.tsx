import React, { useState } from 'react';
import styles from './AddTeam.module.scss';
import { addTeam } from '../../../api/api-teams';
import Button from '../../button/Button';
import { TextField, ThemeProvider } from '@mui/material';
import { defaulTheme } from '../../../assets/styles/theme';

interface AddTeamProps {
    onTeamAdded: () => void;
}

const AddTeam: React.FC<AddTeamProps> = ({ onTeamAdded }) => {
    const [teamName, setTeamName] = useState('');

    const handleAddTeam = async () => {
        if (teamName.trim() === '') {
            alert('Nazwa drużyny nie może być pusta.');
            return;
        }

        try {
            await addTeam(teamName);
            setTeamName('');
            onTeamAdded(); // Odświeżenie listy drużyn po dodaniu
        } catch (error) {
            console.error('Błąd podczas dodawania drużyny:', error);
        }
    };

    return (
        <div className={styles.addTeam}>
            <ThemeProvider theme={defaulTheme}>
                <div className={styles.addTeamInpotWrapper}>
                    <TextField
                        id="outlined-basic"
                        variant="outlined"
                        className={styles.addTeamInput}
                        label="Dodaj team"
                        onChange={e => setTeamName(e.target.value)}
                        value={teamName}
                    />
                </div>
            </ThemeProvider>
            <Button label={'Dodaj drużynę'} onClick={handleAddTeam} />
        </div>
    );
};

export default AddTeam;
