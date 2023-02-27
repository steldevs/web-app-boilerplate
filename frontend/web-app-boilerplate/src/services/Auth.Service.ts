import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { LoginModel } from "../login/Login.Model";
import { RegisterModel } from "../register/Register.Model";
import { loginUserState } from "../state/mainSlice";
import { Root, User } from "../state/types";
import { buildUrl } from "../utils/EndpointProvider";


export const registerUser = async (data: RegisterModel): Promise<boolean> => {
        const newUser = {
            username: data.username,
            email: data.email,
            role: data.accountType,
            password: data.password
        }
    try{
        const response = await axios.post(buildUrl(`user`), newUser, {
            validateStatus: (statusCode) => statusCode === 200 || statusCode === 400,
        });
        if(response.status === 200){
            return true;
        }
        return false;
    } catch (err) {
        return false;
    }
}
export const loginUser = async (data: LoginModel): Promise <false | User> => {
    try{
        const response = await axios.post<User>(buildUrl(`token`), data, {
            withCredentials: true,
            validateStatus: (statusCode) => statusCode === 200 || statusCode === 400,
        });
        if(response.status === 200){
            return response.data;
        }
        return false;
    } catch (err) {
        return false;
    }
}

export const logoutUser = async (): Promise <boolean> => {
    try{
        const response = await axios.delete(buildUrl(`token`), {
            withCredentials: true,
            validateStatus: (statusCode) => statusCode === 200 || statusCode === 400,
        });
        if(response.status === 200){
            return true;
        }
        return false;
    } catch (err) {
        return false;
    }
}


export const useGetAuthenticatedUser = (): User | null => {
    const user = useSelector((state: Root) => state.user);
    return user;
}


export const usePersistUser = async (user: User | null) => {
    const dispatch = useDispatch();
    const wasLoggedIn = localStorage.getItem("username") !== null;

    if(user === null && wasLoggedIn){
        try{
            const response = await axios.get<User>(buildUrl(`token/persist`), {
                withCredentials: true,
                validateStatus: (statusCode: number) => statusCode === 200 || statusCode === 400,
            });
            if(response.status === 200){
                const user = response.data;
                dispatch(loginUserState({user: user}));
            }
        } catch (err) {}
    }
}
