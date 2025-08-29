"use client";

const Loader = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white">
            <div className="flex gap-2">
                {Array.from({ length: 5 }).map((_, i) => (
                    <span
                        key={i}
                        className="w-3 h-3 bg-black rounded-full animate-ping"
                        style={{ animationDelay: `${i * 0.2}s` }}
                    />
                ))}
            </div>
            <p className="mt-6 text-gray-600 font-light animate-pulse">
                Немного блеска...
            </p>
        </div>
    );
};

export default Loader;