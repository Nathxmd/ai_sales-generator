export default function Checkbox({ className = '', ...props }) {
    return (
        <input
            {...props}
            type="checkbox"
            className={
                'rounded border-gray-300 text-accent-600 shadow-sm focus:ring-accent-500 ' +
                className
            }
        />
    );
}
