export default function PrimaryButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={
                `gradient-btn inline-flex items-center justify-center text-sm ${
                    disabled && 'opacity-40 cursor-not-allowed !transform-none !shadow-none'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
