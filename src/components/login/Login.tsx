import React, { useState } from 'react';
import styles from './Login.module.scss';
import { loginUser } from '../../api/api-auth';
import ModalComponent from '../modal/ModalComponent';
import Button from '../button/Button';
import { modalTheme } from '../../assets/styles/theme';
import { TextField, ThemeProvider } from '@mui/material';

interface ILoginProps {
    isModalOpen: boolean;
    toggleModal: (modalState: boolean) => void;
}

const Login: React.FC<ILoginProps> = ({ isModalOpen, toggleModal }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { token } = await loginUser(username, password);
            localStorage.setItem('token', token);
            window.location.reload();
        } catch (err) {
            setError('Nieprawidłowe dane logowania');
        }
    };

    return (
        <ModalComponent modalIsOpen={isModalOpen} closeModal={toggleModal}>
            <div className={styles.loginContainer}>
                <h2>Zaloguj się</h2>
                <form className={styles.form} onSubmit={handleLogin}>
                    <ThemeProvider theme={modalTheme}>
                        <div className={styles.addTeamInpotWrapper}>
                            <TextField
                                id="outlined-basic"
                                variant="outlined"
                                className={styles.addTeamInput}
                                label="Login"
                                onChange={e => setUsername(e.target.value)}
                                value={username}
                                required
                            />
                        </div>
                    </ThemeProvider>
                    <ThemeProvider theme={modalTheme}>
                        <div className={styles.addTeamInpotWrapper}>
                            <TextField
                                id="outlined-basic"
                                type={'password'}
                                variant="outlined"
                                className={styles.addTeamInput}
                                label="Hasło"
                                onChange={e => setPassword(e.target.value)}
                                value={password}
                                required
                            />
                        </div>
                    </ThemeProvider>
                    <Button classes={styles.loginContainerBtn} label={'Zaloguj się'} type={'submit'} />
                </form>
                {error && <p className={styles.loginContainerError}>{error}</p>}
            </div>
        </ModalComponent>
    );
};

export default Login;
