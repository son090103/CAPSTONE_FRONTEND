import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import type { ReactNode, MouseEventHandler, CSSProperties } from 'react';

// ────────────────────────────────────────────────────────────
// TYPES
// ────────────────────────────────────────────────────────────

type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
    children: ReactNode;
    bg?: string;            // màu nền
    color?: string;            // màu chữ
    size?: ButtonSize;
    icon?: ReactNode | null;  // icon bên phải, null = ẩn
    to?: string;            // nếu có → bọc Link
    type?: "button" | "submit" | "reset"; 
    onClick?: MouseEventHandler<HTMLButtonElement>;
    className?: string;
    style?: CSSProperties;
    disabled?: boolean;
}

// ────────────────────────────────────────────────────────────
// SIZE MAP
// ────────────────────────────────────────────────────────────

const SIZE: Record<ButtonSize, string> = {
    sm: 'px-6  py-3  text-sm   gap-2',
    md: 'px-10 py-5  text-base gap-3',
    lg: 'px-12 py-7  text-xl   gap-4',
};

// ────────────────────────────────────────────────────────────
// BUTTON — 1 form duy nhất, màu truyền vào qua props
// ────────────────────────────────────────────────────────────

export function Button({
    children,
    bg = 'transparent',
    color = '#ffffff',
    size = 'md',
    icon = null,
    to,
    onClick,
    className = '',
    style = {},
    disabled = false,
}: ButtonProps) {
    const btn = (
        <motion.button
            whileHover={disabled ? undefined : { scale: 1.05, filter: 'brightness(1.08)' }}
            whileTap={disabled ? undefined : { scale: 0.95 }}
            onClick={disabled ? undefined : onClick}
            disabled={disabled}
            style={{ backgroundColor: bg, color, ...style }}
            className={`
                rounded-full font-bold shadow-md
                flex items-center transition-all
                ${SIZE[size]}
                ${className}
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
        >
            {children}
            {icon && <span>{icon}</span>}
        </motion.button>
    );

    return to ? <Link to={to}>{btn}</Link> : btn;
}