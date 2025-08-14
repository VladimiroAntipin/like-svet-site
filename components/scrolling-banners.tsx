// components/scrolling-banner.tsx
"use client";

import React from "react";

const ScrollingBanner: React.FC = () => {
    return (
        <div className="w-full bg-black overflow-hidden py-3 relative z-0 mt-4">
            <div className="whitespace-nowrap flex animate-marquee">
                {Array(10)
                    .fill("Приобретайте у нас сертификаты для себя, друзей и родственников!")
                    .map((text, i) => (
                        <span
                            key={i}
                            className="mx-1 flex items-center text-gray-300 font-medium"
                        >
                            {text}
                            <span className="mx-2 text-gray-300 text-2xl leading-none">•</span>
                        </span>
                    ))}
            </div>
        </div>
    );
};

export default ScrollingBanner;
