import { Box, Button, FormControl, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import { FormStyles } from "../App.styles";
import { dictionary } from "../utils/dictionary";
import { LoginModel } from "./Login.Model";

interface Props {
    onSubmit(data: LoginModel): void
}

const LoginForm = ({ onSubmit }: Props) => {
    const { register, handleSubmit, formState: {errors}} = useForm<LoginModel>();

    return(
            <Box>
                <form id="login-form" onSubmit={handleSubmit(onSubmit)}>
                <Box>
                    <FormControl fullWidth>
                        <TextField
                            id="username-field"
                            label="Username"
                            placeholder="Username"
                            {...register("username", { required: true })}
                            error={errors.username !== undefined}
                            helperText={errors.username?.message !== undefined ? dictionary.formErrors.required : ""}
                        />
                    </FormControl>
                </Box>
                <Box sx={FormStyles.fieldBox}>
                    <FormControl fullWidth>
                        <TextField
                            id="password-field"
                            label="Password"
                            placeholder="Password"
                            type="password"
                            {...register("password", { required: true })}
                            error={errors.password !== undefined}
                            helperText={errors.password?.message !== undefined ? dictionary.formErrors.required : ""}
                        />
                    </FormControl>
                </Box>
                <Box sx={FormStyles.fieldBox}>
                    <Button 
                        id="login-btn"
                        aria-label="Login"
                        type="submit" 
                        sx={FormStyles.field} 
                        variant="contained"
                    >
                        Login
                    </Button>
                </Box>
                </form>
            </Box>
    )

}

export default LoginForm;