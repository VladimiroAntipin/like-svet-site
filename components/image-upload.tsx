'use client';

import { useEffect, useState } from "react";
import { ImagePlusIcon } from "lucide-react";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";

interface ImageUploadProps {
    disabled?: boolean;
    onChange: (value: string) => void;
    value: string[];
}

const ImageUpload: React.FC<ImageUploadProps> = ({ disabled, onChange, value }) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => setIsMounted(true), []);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleUpload = (result: any) => {
        const url = result?.info?.secure_url as string | undefined;
        if (url) onChange(url);
    };

    if (!isMounted) return null;

    return (
        <div className="flex flex-wrap gap-4">
            {value.map((url) => (
                <div key={url} className="relative w-[150px] h-[150px] rounded-full overflow-hidden group max-[500px]:w-[100px] max-[500px]:h-[100px]">
                    <Image fill className="object-cover object-center" alt="image" src={url} />

                    {/* Icona + overlay solo al hover */}
                    <CldUploadWidget
                        onSuccess={handleUpload}
                        uploadPreset="cmnontpg"
                        options={{ multiple: false }}
                    >
                        {({ open }) => (
                            <button
                                type="button"
                                disabled={disabled}
                                onClick={() => open()}
                                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-10 opacity-0 group-hover:opacity-100 text-white transition cursor-pointer"
                            >
                                <ImagePlusIcon className="w-6 h-6" />
                            </button>
                        )}
                    </CldUploadWidget>
                </div>
            ))}

            {/* Se non ci sono immagini, mostra il placeholder cliccabile */}
            {value.length === 0 && (
                <CldUploadWidget
                    onSuccess={handleUpload}
                    uploadPreset="cmnontpg"
                    options={{ multiple: false }}
                >
                    {({ open }) => (
                        <div
                            onClick={() => open()}
                            className="relative w-[150px] h-[150px] rounded-full border border-gray-300 bg-gray-200 flex items-center justify-center cursor-pointer group max-[500px]:w-[100px] max-[500px]:h-[100px]"
                        >
                            <ImagePlusIcon className="w-8 h-8 text-gray-500" />
                        </div>
                    )}
                </CldUploadWidget>
            )}
        </div>
    );
};

export default ImageUpload;
