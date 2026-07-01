import React from 'react';

type ButtonProps = {
    title: string;
    type?: 'button' | 'submit' | 'reset';
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button: React.FC<ButtonProps> = ({ title, type = 'button', ...props }) => {
    return (
        <button
            type={type}
            className="inline-block text-base text-[12px] px-2 py-2 bg-(--secondary) text-(--primary) rounded-lg hover:opacity-90 transition mt-2 mb-2 disabled:opacity-50"
            {...props}
        >
            {title}
        </button>
    );
}

export default Button;