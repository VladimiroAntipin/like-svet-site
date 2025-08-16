interface ContainerProps {
    children: React.ReactNode
}

const Container: React.FC<ContainerProps> = ({ children }) => {
    return (
        <div className="flex items-center justify-center w-full">
            <div className="flex flex-col gap-y-8 mt-0 w-[85vw] max-[500px]:w-[95vw] ">
                {children}
            </div>
        </div>
    );
}

export default Container;