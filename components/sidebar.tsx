"use client";

import { X } from "lucide-react";
import React, { useEffect } from "react";

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    children?: React.ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, children }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.classList.add("overflow-hidden");
        } else {
            document.body.classList.remove("overflow-hidden");
        }
    
        return () => {
            document.body.classList.remove("overflow-hidden");
        };
    }, [isOpen]);

    return (
        <>
            {/* Overlay */}
            <div className={`fixed inset-0 bg-white/70 backdrop-blur-xs z-40 transition-opacity duration-300 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`} onClick={onClose} />

            {/* Sidebar */}
            <div className={`fixed top-0 right-0 h-full w-72 bg-white shadow-xl z-50 transform transition-transform duration-500 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
                {/* Close Button */}
                <div className="flex justify-end p-4">
                    <button onClick={onClose} className="rounded-full p-2 hover:bg-gray-100 cursor-pointer" >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">{children}</div>
            </div>
        </>
    );
};

export default Sidebar;
