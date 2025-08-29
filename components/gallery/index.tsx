'use client';

import { TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import Image from "next/image";
import { Image as ImageType } from "@/types";
import GalleryTab from "./gallery-tab";

interface GalleryProps {
    images: ImageType[];
}

const Gallery: React.FC<GalleryProps> = ({ images }) => {
    return (
        <TabGroup as="div" className='flex flex-col-reverse'>
            <div className="mt-6 w-full max-w-2xl lg:max-w-none">
                <TabList className='grid grid-cols-6 gap-6'>
                    {images.map((image) => (
                        <GalleryTab key={image.id} image={image} />
                    ))}
                </TabList>
            </div>
            <TabPanels className='aspect-square w-[500px] max-[1250px]:w-[400px] max-[500px]:w-full '>
                {images.map((image) => (
                    <TabPanel key={image.id}>
                        <div className="aspect-square relative h-full w-full overflow-hidden">
                            <Image fill src={image.url} alt="image" className="object-cover object-center" sizes="(max-width: 500px) 100vw, 500px"/>
                        </div>
                    </TabPanel>
                ))}
            </TabPanels>
        </TabGroup>
    );
}

export default Gallery;