import { Card, Typography, CircularProgress, Box } from "@mui/material";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate, Navigate  } from "react-router-dom";
import { FormStyles } from "../App.styles";
import  SampleLogoImg from "../assets/sample_logo.png";
import { loginUser, useGetAuthenticatedUser } from "../services/Auth.Service";
import { loginUserState } from "../state/mainSlice";
import If from "../utils/If";
import LoginForm from "./Form";
import { LoginModel } from "./Login.Model";

const Login = () => {
    const user = useGetAuthenticatedUser();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);
    const [loginFailed, setLoginFailed] = useState<boolean>(false);

    const onSubmit = async (data: LoginModel) => {
        setLoading(true);
        setLoginFailed(false);
        const user = await loginUser(data);
        if(user){
            dispatch(loginUserState({user: user}));
            return navigate("/");
        }else{
            setLoginFailed(true);
        }
        setLoading(false);   
    }

    if(user !== null){
        return (<Navigate to="/" replace={true} />);
    }

    return(
        <>
            <Card sx={FormStyles.card}>
                    <Box>
                        <img src={SampleLogoImg} width="200"/>
                    </Box>
                    <Box sx={FormStyles.spacingTop}>
                        <Typography variant="h1" fontSize={24}>
                            Welcome to the WebApp Boilerplate app
                        </Typography>
                    </Box>
                    <Box sx={FormStyles.container}>
                        { loading ?
                            <Box sx={FormStyles.loadingBox}>
                                <CircularProgress />
                            </Box>
                            :
                            <LoginForm onSubmit={onSubmit}/>
                        }
                        <If condition={loginFailed}>
                            <Typography align="left" sx={FormStyles.textError}>Login failed. Please try again</Typography>
                        </If>
                        <Typography fontSize={14} align="left" sx={FormStyles.spacingTop}>
                            Need to register? <Link to="/register"> Click here</Link>
                        </Typography>
                    </Box>
            </Card>
        </>
    )
}

export default Login;