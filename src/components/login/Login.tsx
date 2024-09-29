import React, { useState } from 'react';
import styles from './Login.module.scss';
import { loginUser } from '../../api/api-auth';
import ModalComponent from '../modal/ModalComponent';

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
                    <input
                        className={styles.formInput}
                        type="text"
                        placeholder="Nazwa użytkownika"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        required
                    />
                    <input
                        className={styles.formInput}
                        type="password"
                        placeholder="Hasło"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                    <button className={styles.formButton} type="submit">
                        Zaloguj
                    </button>
                </form>
                {error && <p className={styles.error}>{error}</p>}
            </div>
        </ModalComponent>
    );
};

export default Login;
