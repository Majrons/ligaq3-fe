import React, { useState } from 'react';
import { addTeam } from '../../../api/api-teams';

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
        <div className="add-team">
            <input
                type="text"
                placeholder="Nazwa drużyny"
                value={teamName}
                onChange={e => setTeamName(e.target.value)}
            />
            <button onClick={handleAddTeam}>Dodaj drużynę</button>
        </div>
    );
};

export default AddTeam;
