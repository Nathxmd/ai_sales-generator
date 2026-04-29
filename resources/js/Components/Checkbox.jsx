export default function Checkbox({ className = '', ...props }) {
    return (
        <input
            {...props}
            type="checkbox"
            className={
                'rounded border-white/20 bg-white/5 text-accent-violet shadow-sm focus:ring-accent-violet focus:ring-offset-0 focus:ring-offset-transparent ' +
                className
            }
        />
    );
}
