import { Box, Button, TextField, FormControl, MenuItem } from "@mui/material";
import { useForm } from "react-hook-form";
import { FormStyles } from "../../App.styles";
import SelectComponent from "../../components/form/SelectComponent";
import { User } from "../../state/types";
import { dictionary } from "../../utils/dictionary";

interface Props {
    user: User;
    onSubmit: (data: User) => void;
}

const EditForm = ({ user, onSubmit }: Props) => {
    const { control, register, handleSubmit, formState: {errors}} = useForm<User>(
      {
        defaultValues: user
      });

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
                        name="role"
                        label="Account type"
                        control={control}
                        defaultValue=""
                        error={errors.role !== undefined}
                        helperText={errors.role?.message !== undefined ? dictionary.formErrors.required : ""}
                    >
                        <MenuItem key="0" value="admin">Administrator</MenuItem>
                        <MenuItem key="1" value="user">User</MenuItem>
                    </SelectComponent>
                </Box>
                <Box sx={FormStyles.fieldBox}>
                    <Button type="submit" sx={FormStyles.field} variant="contained">Save user</Button>
                </Box>
                </form>
            </Box>
    )

}


export default EditForm;