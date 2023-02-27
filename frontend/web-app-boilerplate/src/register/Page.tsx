import { Card, Typography, CircularProgress, Box } from "@mui/material";
import RegisterForm from "./Form";
import { Link, useNavigate } from "react-router-dom";
import { FormStyles } from "../App.styles";
import { RegisterModel } from "./Register.Model";
import { useState } from "react";
import { registerUser } from "../services/Auth.Service";
import If from "../utils/If";


const Register = () => {
    const navigate = useNavigate();

    const [loading, setLoading] = useState<boolean>(false);
    const [registrationFailed, setRegistrationFailed] = useState<boolean>(false);

    const onSubmit = async (data: RegisterModel) => {
        setLoading(true);
        setRegistrationFailed(false);
        const userRegistered = await registerUser(data);
        if(userRegistered){
            return navigate("/");
        }else{
            setRegistrationFailed(true);
        }
        setLoading(false);   
    }

    return(
        <Card sx={FormStyles.card}>
            <Box sx={FormStyles.spacingTop}>
                <Typography variant="h1" fontSize={24}>
                    Register as a user or an admin
                </Typography>
            </Box>
            <Box sx={FormStyles.container}>
                {loading ?
                    <Box sx={FormStyles.loadingBox}>
                        <CircularProgress />
                    </Box>
                    :
                    <RegisterForm onSubmit={onSubmit} />
                }
                <If condition={registrationFailed}>
                    <Typography align="left" sx={FormStyles.textError}>Registration failed. Try a different username.</Typography>
                </If>
                <Typography fontSize={14} align="left" sx={FormStyles.spacingTop}>
                    Already have an account? <Link to="/login">Click here to login</Link>
                </Typography>
            </Box>
        </Card>
    )


}


export default Register;