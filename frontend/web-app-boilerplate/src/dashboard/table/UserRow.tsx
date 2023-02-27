import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { User } from '../../state/types';
import { IconButton } from '@mui/material';
import axios from 'axios';
import { buildUrl } from '../../utils/EndpointProvider';

interface Props {
    user: User;
    setSelectedUser: (user: User | null) => void;
    refetch: () => void;
}

const UserRow = ({ user, setSelectedUser, refetch }: Props) => {

    const deleteUser = async () => {
        const response = await axios.delete(buildUrl(`user/${user.id}`), {
            withCredentials: true,
        });
        if(response.status === 200){
           refetch();
        }
    }


    return(
            <TableRow
                key={user.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
                <TableCell>
                    {user.id}
                </TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                    <IconButton>
                        <EditIcon onClick={() => setSelectedUser(user)} />
                    </IconButton>
                    <IconButton onClick={() => deleteUser()}>
                        <DeleteIcon />
                    </IconButton>
                </TableCell>
            </TableRow>
    )
}

export default UserRow;