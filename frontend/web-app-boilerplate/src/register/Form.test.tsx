import {render, screen, waitFor} from '@testing-library/react'
import userEvent from '@testing-library/user-event';
import { dictionary } from '../utils/dictionary';
import RegisterForm from "./Form";
import { byRole } from "testing-library-selector";

describe('Login form tests', () => {

    const ui = {
        username: byRole("textbox", { name: /username/i }),
        email: byRole("textbox", { name: /email address/i }),
        accountType: byRole("button", { name: /account type/i }),
        password: () => screen.getByLabelText("Password"),
        passwordConfirmation: () => screen.getByLabelText("Confirm password"),
        registerBtn: byRole("button", { name: /register/i }),
        adminOption: byRole("option", { name: /administrator/i }),
        userOption: byRole("option", { name: /user/i })
    }

    const onSubmitSpy = jest.fn();

    it('Renders correctly', () => {
        render(<RegisterForm onSubmit={onSubmitSpy} />);

        expect(ui.username.get()).toBeInTheDocument();
        expect(ui.email.get()).toBeInTheDocument();
        expect(ui.accountType.get()).toBeInTheDocument();
        expect(ui.password()).toBeInTheDocument();
        expect(ui.passwordConfirmation()).toBeInTheDocument();
        expect(ui.registerBtn.get()).toBeInTheDocument();
    });

    it('Password and confirm password fields have the correct input type', () => {
        render(<RegisterForm onSubmit={onSubmitSpy} />);

        expect(ui.password()).toHaveAttribute("type", "password");
        expect(ui.passwordConfirmation()).toHaveAttribute("type", "password");
    });

    it('Validates fields correctly', async () => {
        render(<RegisterForm onSubmit={onSubmitSpy}/>);

        await userEvent.click(ui.registerBtn.get());

        await waitFor(() => {
            expect(screen.getAllByText(dictionary.formErrors.required)).toHaveLength(5);
            expect(onSubmitSpy).toHaveBeenCalledTimes(0);
        });
    });

    it('Checks if password confirmation is the same with original password', async () => {
        render(<RegisterForm onSubmit={onSubmitSpy}/>);

        await userEvent.type(ui.password(),"myPassword");
        await userEvent.type(ui.passwordConfirmation(),"myDifferentPassword");

        
    })

    it('Submits values correctly', async () => {
        render(<RegisterForm onSubmit={onSubmitSpy}/>);

        await userEvent.type(ui.username.get(),"myUsername");
        await userEvent.type(ui.email.get(),"myEmail@email.com");
        await userEvent.type(ui.password(),"myPassword");
        await userEvent.click(ui.accountType.get());
        await userEvent.click(ui.userOption.get());
        await userEvent.type(ui.passwordConfirmation(),"myPassword");
        await userEvent.click(ui.registerBtn.get());

        await waitFor(() =>
            expect(onSubmitSpy).toHaveBeenCalledTimes(1)
        )
    })

})