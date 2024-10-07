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
            </ul>
        </nav>
    );
};

export default Menu;
