import { Box, Card, Typography } from "@mui/material";
import useAxios from "axios-hooks";
import { useGetAuthenticatedUser } from "../services/Auth.Service";
import { DashboardStyles } from "./Styles";
import UsersTable from "./table/UsersTable";
import { useState } from "react";
import UserDialog from "./dialog/EditUserDialog";
import { User } from "../state/types";
import { buildUrl } from "../utils/EndpointProvider";

const Dashboard = () => {
const user = useGetAuthenticatedUser();

const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
const [{ data, loading, error }, refetch] = useAxios<any>(
    {
        url: buildUrl(`user`),
        method: 'GET',
        withCredentials: true,
    },
    { 
        manual: false
    },
);

    if(!loading && data){
        return(
            <>
                <Box sx={DashboardStyles.global}>
                    <Typography variant="h4">{`Welcome to the dashboard, ${user?.username}!`}</Typography>
                    <Card>
                        <UsersTable refetch={refetch} data={data} setSelectedUser={setSelectedUser} />
                    </Card>
                </Box>
                <UserDialog selectedUser={selectedUser} onClose={() => setSelectedUser(null)} refetch={refetch} />
            </>
        );
    }else{
        return <></>;
    }


}

export default Dashboard;