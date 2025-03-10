
const VoiceVisualizer = ({ isListening }: { isListening: boolean }) => {
  return (
    <div className="flex items-center justify-center gap-1 h-8 my-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className={`w-1.5 rounded-full transition-all duration-200 ${
            isListening 
              ? 'animate-[bounce_1s_ease-in-out_infinite] bg-gradient-to-t from-blue-500 to-indigo-600' 
              : 'h-1 bg-blue-300'
          }`}
          style={{
            animationDelay: `${i * 0.1}s`,
            height: isListening ? '2rem' : '0.25rem',
            transform: isListening ? 'scaleY(1)' : 'scaleY(0.5)'
          }}
        />
      ))}
    </div>
  );
};

export default VoiceVisualizer;
