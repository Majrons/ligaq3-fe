// Navbar.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Menu.module.scss';

const Menu: React.FC = () => {
    return (
        <nav className={styles.menu}>
            <ul>
                <li>
                    <Link to="/">Strona Główna</Link>
                </li>
                <li>
                    <Link to="/teams">Teams</Link>
                </li>
                <li>
                    <Link to="/archive">Archiwum Kwartałów</Link>
                </li>
                <li>
                    <Link to="/regulamin">Regulamin</Link>
                </li>
            </ul>
        </nav>
    );
};

export default Menu;
