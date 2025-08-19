import Image from "next/image";
import photo from "@/public/about-us.webp";

const AboutUs = () => {
    return (
        <div className="mt-15 flex max-[500px]:flex-col-reverse gap-6 w-[50vw] max-[500px]:w-full mx-auto">
            <Image src={photo} alt="photo" className="w-[50%] max-[500px]:w-full" />
            <div className="flex flex-col gap-y-4">
                <h2 className="font-bold text-3xl">О нас</h2>
                <hr className="my-4 border-gray-900 " />
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti, iusto quam sed eum suscipit atque iure consequuntur. Est, aspernatur voluptatem pariatur a, fugit et ullam eos officia repellat velit tempore.</p>
            </div>
        </div>
    );
}

export default AboutUs;