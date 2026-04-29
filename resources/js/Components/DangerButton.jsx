export default function DangerButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-400 transition duration-200 ease-in-out hover:bg-red-500/20 hover:text-red-300 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:ring-offset-0 active:bg-red-500/30 ${
                    disabled && 'opacity-40 cursor-not-allowed'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
