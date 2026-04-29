export default function SecondaryButton({
    type = 'button',
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            type={type}
            className={
                `inline-flex items-center rounded-lg border border-white/10 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-dark-100 transition duration-200 ease-in-out hover:bg-white/[0.1] hover:text-white focus:outline-none focus:ring-2 focus:ring-accent-violet/30 focus:ring-offset-0 ${
                    disabled && 'opacity-40 cursor-not-allowed'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
