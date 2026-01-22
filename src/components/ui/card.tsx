import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface CardProps {
    className?: string;
    children: React.ReactNode;
    colSpan?: number;
    rowSpan?: number;
}

export function Card({ className, children, colSpan = 1, rowSpan = 1 }: CardProps) {
    return (
        <div
            className={twMerge(
                clsx(
                    "bg-card rounded-3xl border border-border-light overflow-hidden transition-all duration-300 hover:border-border-hover relative group",
                    className
                )
            )}
            style={{
                gridColumn: `span ${colSpan}`,
                gridRow: `span ${rowSpan}`,
            }}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            {children}
        </div>
    );
}
