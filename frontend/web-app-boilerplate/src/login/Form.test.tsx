import {render, screen, waitFor} from '@testing-library/react'
import userEvent from '@testing-library/user-event';
import LoginForm from "./Form";
import { byRole } from "testing-library-selector";

describe('Login form tests', () => {

    const ui = {
        username: byRole("textbox", { name: /username/i }),
        password: () => screen.getByLabelText("Password"),
        loginBtn: byRole("button", { name: /login/i })
    }

    const onSubmitSpy = jest.fn();

    it('Renders correctly', () => {
        render(<LoginForm onSubmit={onSubmitSpy} />);

        expect(ui.username.get()).toBeInTheDocument();
        expect(ui.password()).toBeInTheDocument();
        expect(ui.loginBtn.get()).toBeInTheDocument();
    });

    it('Password field has the correct input type', () => {
        render(<LoginForm onSubmit={onSubmitSpy} />);

        expect(ui.password()).toHaveAttribute("type", "password");
    });

    it('Does not submit if there are errors', async () => {
        render(<LoginForm onSubmit={onSubmitSpy}/>);

        await userEvent.click(ui.loginBtn.get());

        await waitFor(() =>
            expect(onSubmitSpy).toHaveBeenCalledTimes(0)
        )
    })

    it('Submits when data is valid', async () => {
        render(<LoginForm onSubmit={onSubmitSpy}/>);

        await userEvent.type(
            ui.username.get(),
            "myUsername"
        );
        await userEvent.type(
            ui.password(),
            "myPassword"
        );

        await userEvent.click(ui.loginBtn.get());

        await waitFor(() =>
            expect(onSubmitSpy).toHaveBeenCalledTimes(1)
        )
    })

})