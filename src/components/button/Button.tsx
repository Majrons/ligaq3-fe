import React from 'react';
import styles from './Button.module.scss';
import classnames from 'classnames';

interface IButtonProps {
    label: string;
    classes?: string;
    onClick?(argument?: any): void;
    type?: string;
}

const Button: React.FC<IButtonProps> = ({ label, classes, onClick, type }) =>
    type === 'submit' ? (
        <button className={classnames(styles.btn, classes)} type={type}>
            {label}
        </button>
    ) : (
        <button className={classnames(styles.btn, classes)} onClick={onClick}>
            {label}
        </button>
    );

export default Button;
