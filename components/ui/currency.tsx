'use client';

import { useEffect, useState } from "react";

const formatter = (priceInKopecks: number) => {
    const rubles = priceInKopecks / 100;

    return new Intl.NumberFormat("ru-RU", {
        style: 'currency',
        currency: 'RUB',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(rubles);
};

interface CurrencyProps {
    data?: string | number
}

const Currency: React.FC<CurrencyProps> = ({ data }) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, [])

    if (!isMounted) {
        return null;
    }

    return (
        <div className="font-semibold ">
            {formatter(Number(data))}
        </div>
    );
}

export default Currency;