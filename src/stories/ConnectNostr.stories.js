import { fn } from '@storybook/test';
import { ConnectNostr } from './ConnectNostr';
import { userEvent, within, expect } from '@storybook/test';

export default {
  title: 'ConnectNostr',
  component: ConnectNostr,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: { onClick: fn() },
};

export const Primary = {
  args: {
    primary: true,
    nip07Status: false
  },
};

export const Secondary = {
  args: {
    nip07Status: true
  },
};


export const InvalidNSEC = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 👇 Simulate interactions with the component
    // let test = await canvas.findByText('NSEC')
    // console.log(test)
    await userEvent.clear(canvas.getByTestId('nsec_input'));
    await userEvent.type(canvas.getByTestId('nsec_input'), "TEST");

    // See https://storybook.js.org/docs/essentials/actions#automatically-matching-args to learn how to setup logging in the Actions panel
    
    let test_value = await canvas.getByTestId('nsec_validator').value
    console.log(test_value)

    // 👇 Assert DOM structure
    await expect(
      canvas.getByText(
        'NSEC is Invalid',
      ),
    ).toBeInTheDocument();
  },
};

export const ValidNSEC = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 👇 Simulate interactions with the component
    // let test = await canvas.findByText('NSEC')
    // console.log(test)
    await userEvent.clear(canvas.getByTestId('nsec_input'));
    await userEvent.type(canvas.getByTestId('nsec_input'), "nsec4c2e80dc29e32fc6503f4b7391002729ca962b747d255b6f593565b1ea78e733");

    // See https://storybook.js.org/docs/essentials/actions#automatically-matching-args to learn how to setup logging in the Actions panel
    
    let test_value = await canvas.getByTestId('nsec_validator').value
    console.log(test_value)

    // 👇 Assert DOM structure
    await expect(
      canvas.getByText(
        'NSEC is Valid please select Submit below',
      ),
    ).toBeInTheDocument();
  },
};