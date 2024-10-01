import React from 'react';
import styles from './Button.module.scss';
import classnames from 'classnames';

interface IButtonProps {
    label: string;
    classes?: string;
    onClick(argument?: any): void;
}

const Button: React.FC<IButtonProps> = ({ label, classes, onClick }) => (
    <button className={classnames(styles.btn, classes)} onClick={onClick}>
        {label}
    </button>
);

export default Button;
