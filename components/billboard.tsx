import { Billboard as BillboardType } from "@/types";
import React from "react";

interface BillboardProps {
    data: BillboardType;
}

const Billboard: React.FC<BillboardProps> = ({ data }) => {
    return (
        <div className="w-full h-full">
            <div
                className="relative w-full h-full bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: `url(${data?.imageUrl})`,
                }}
            >
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/10" />
            </div>
        </div>
    );
};

export default Billboard;