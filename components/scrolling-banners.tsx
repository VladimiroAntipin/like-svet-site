"use client";

import React from "react";
import Marquee from "react-fast-marquee";

const ScrollingBanner: React.FC = () => {
    const textItems = Array(10)
        .fill("Приобретайте у нас сертификаты для себя, друзей и родственников!");

    return (
        <div className="w-full bg-black overflow-hidden py-3 relative z-0 mt-4">
            <Marquee gradient={false} speed={70}>
                {textItems.map((text, i) => (
                    <span
                        key={i}
                        className="mx-1 flex items-center text-gray-300 font-medium"
                    >
                        {text}
                        <span className="mx-2 text-gray-300 text-2xl leading-none">•</span>
                    </span>
                ))}
            </Marquee>
        </div>
    );
};

export default ScrollingBanner;

