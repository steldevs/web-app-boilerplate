import {render, screen} from '@testing-library/react'
import If from './If'

describe('If component tests', () => {

    it('Renders correctly when condition is true', () => {
        render(
        <If condition={true}>
            <p>Child has been rendered</p>
        </If>
        );

        expect(screen.getByText(`Child has been rendered`)).toBeInTheDocument();
    });

    it('Renders correctly when condition is false', () => {
        render(
        <If condition={false}>
            <p>Child has been rendered</p>
        </If>
        );

        expect(screen.queryByText(`Child has been rendered`)).not.toBeInTheDocument();
    });

});