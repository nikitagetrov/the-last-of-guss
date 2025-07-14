interface GooseProps {
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

export const Goose: React.FC<GooseProps> = ({ onClick, disabled = false, className = '' }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`goose-button ${className} ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      }`}
    >
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Гусь */}
        <img
          src="/Goose-PNG-Picture.png"
          alt="Гусь с мутацией G-42-"
          className="relative z-10 w-full h-full object-contain"
          draggable={false}
          style={{
            filter: 'drop-shadow(2px 2px 6px rgba(0,0,0,0.4))',
            mixBlendMode: 'normal'
          }}
        />
      </div>
    </button>
  );
};
