"use client";

import { useRouter } from "next/navigation";

const ClearFiltersButton = () => {
    const router = useRouter();

    const handleClick = () => {
        router.push("/?limit=8", { scroll: false });
    };

    return (
        <button
            className="text-md font-thin text-start cursor-pointer"
            onClick={handleClick}
        >
            Смотреть все
        </button>
    );
};

export default ClearFiltersButton;



