import { Box, Button, TextField, FormControl, MenuItem } from "@mui/material";
import { useForm } from "react-hook-form";
import { FormStyles } from "../App.styles";
import SelectComponent from "../components/form/SelectComponent";
import { dictionary } from "../utils/dictionary";
import { RegisterModel } from "./Register.Model";

interface Props {
    onSubmit(data: RegisterModel): void
}

const RegisterForm = ({ onSubmit }: Props) => {
    const { control, getValues, register, handleSubmit, formState: {errors}} = useForm<RegisterModel>();

    return(
            <Box>
                <form id="register-form" onSubmit={handleSubmit(onSubmit)}>
                <Box>
                    <FormControl fullWidth>
                        <TextField
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
                            label="Email address"
                            placeholder="Email address"
                            {...register("email", { required: true })}
                            error={errors.email !== undefined}
                            helperText={errors.email?.message !== undefined ? dictionary.formErrors.required : ""}
                        />
                    </FormControl>
                </Box>
                <Box sx={{textAlign: "left", ...FormStyles.fieldBox}}>
                    <SelectComponent 
                        name="accountType"
                        label="Account type"
                        control={control}
                        defaultValue=""
                        error={errors.accountType !== undefined}
                        helperText={errors.accountType?.message !== undefined ? dictionary.formErrors.required : ""}
                    >
                        <MenuItem key="0" value="admin">Administrator</MenuItem>
                        <MenuItem key="1" value="user">User</MenuItem>
                    </SelectComponent>
                </Box>
                <Box sx={FormStyles.fieldBox}>
                    <FormControl fullWidth>
                        <TextField
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
                    <FormControl fullWidth>
                        <TextField
                            label="Confirm password"
                            placeholder="Confirm password"
                            type="password"
                            {...register("passwordConfirmation", { required: { value: true, message: dictionary.formErrors.required}, validate: (value) => 
                                getValues().password === value || dictionary.formErrors.passwordMismatch
                            })}
                            error={errors.passwordConfirmation !== undefined}
                            helperText={errors.passwordConfirmation?.message !== undefined ? errors.passwordConfirmation?.message.toString() : ""}
                        />
                    </FormControl>
                </Box>
                <Box sx={FormStyles.fieldBox}>
                    <Button type="submit" sx={FormStyles.field} variant="contained">Register</Button>
                </Box>
                </form>
            </Box>
    )
}

export default RegisterForm;