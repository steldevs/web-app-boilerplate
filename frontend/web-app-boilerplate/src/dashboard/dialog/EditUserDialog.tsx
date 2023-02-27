import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Form from './EditForm';
import { User } from '../../state/types';
import axios from 'axios';
import { buildUrl } from '../../utils/EndpointProvider';

interface props {
    selectedUser: User | null;
    onClose: () => void;
    refetch: () => void;
}

const EditUserDialog = ({ selectedUser, onClose, refetch}: props) => {

    const onSubmit = async (data: User) => {
        const response = await axios.put(buildUrl(`user`), data, {
            withCredentials: true,
        });
        if(response.status === 200){
           refetch();
           onClose();
        }
    }

    return(
        <Dialog open={selectedUser !== null} onClose={onClose}>
            <DialogTitle>Edit user: {selectedUser?.email}</DialogTitle>
            <DialogContent>
                <DialogContentText sx={{paddingBottom: 2}}>
                    Use the following form to edit a user from the database.
                </DialogContentText>
                <Form user={selectedUser!} onSubmit={onSubmit}/>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
            </DialogActions>
        </Dialog>
    )
}

export default EditUserDialog;