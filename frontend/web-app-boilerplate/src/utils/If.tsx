interface Props {
    condition: boolean;
    children: React.ReactNode;
}

const If = ({condition, children}: Props) => (
    <>{condition && children}</>
)

export default If;