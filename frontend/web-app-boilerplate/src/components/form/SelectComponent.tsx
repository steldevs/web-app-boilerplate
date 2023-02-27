
import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from "@mui/material";
import { Controller } from "react-hook-form";

interface Props {
    name: string;
    label: string;
    control: any;
    defaultValue: string;
    children: any;
    helperText: string;
    error: boolean;
}

const SelectComponent = ({
  name,
  label,
  control,
  defaultValue,
  children,
  helperText,
  error,
  ...props
}: Props) => {
  const labelId = `${name}-label`;
  return (
    <FormControl {...props} fullWidth>
      <InputLabel id={labelId}>{label}</InputLabel>
      <Controller
        rules={{ required: true }}
        render={({ field }) => (
            <Select labelId={labelId} label={label} {...field} error={error}>
                {children}
            </Select>
        )}
        name={name}
        control={control}
        defaultValue={defaultValue}
      />
      <FormHelperText sx={{color:'red'}}>{helperText}</FormHelperText>
    </FormControl>
  );
};
export default SelectComponent;