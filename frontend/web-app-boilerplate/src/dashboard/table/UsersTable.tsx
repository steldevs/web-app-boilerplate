import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { User } from '../../state/types';
import UserRow from './UserRow';

interface Props {
    data: User[];
    setSelectedUser: (user: User | null) => void;
    refetch: () => void;
}

const cols = ["Id", "Username", "Email", "Role", "Actions"];

const UsersTable = ({ data, setSelectedUser, refetch }: Props) => {
    return(
        <>
            <TableContainer component={Paper}>
                <Table aria-label="Users table">
                    <TableHead>
                    <TableRow>
                        {cols.map((col: string) => (
                            <TableCell>{col}</TableCell>
                        ))}
                    </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((user: User) => (
                            <UserRow refetch={refetch} user={user} setSelectedUser={setSelectedUser}/>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}

export default UsersTable;