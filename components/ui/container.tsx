interface ContainerProps {
    children: React.ReactNode
}

const Container: React.FC<ContainerProps> = ({children}) => {
    return ( 
        <div className="flex items-center justify-center w-full">
            {children}
        </div>
     );
}
 
export default Container;