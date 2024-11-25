interface IconButtonProps {
    icon: React.ReactNode;
    label: string;
    isOpen?: boolean;
    disabled?: boolean;
    onClick?: () => void;
    customClasses?: string;
}

const IconButton = ({ icon, label, isOpen, disabled, onClick, customClasses }: IconButtonProps) => (
    <button
        type="button"
        onClick={onClick}
        className={`inline-flex items-center justify-center gap-2 font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50 bg-gray-200 border bg-background shadow-sm rounded-md px-3 text-xs h-8 border-gray-300 hover:bg-gray-300 focus:outline-none ${customClasses}`}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        data-state={isOpen ? 'open' : 'closed'}
        disabled={disabled}
    >
        <div className="">
            {icon}
        </div>
        <span className="whitespace-nowrap">{label}</span>
    </button>
);

export default IconButton;