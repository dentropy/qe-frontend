import { fn } from '@storybook/test';
import { userEvent, within, expect } from '@storybook/test';


import { RenderModals } from './RenderModals';

export default {
    title: 'RenderModals',
    component: RenderModals,
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

export const Example = {
    args: {
        primary: true,
        modalSelected: "ModalExample"
    },
};

export const ModalInvalidCoupon = {
    args: {
        primary: true,
        modalSelected: "ModalInvalidCoupon"
    },
};

export const ModalValidCoupon = {
    args: {
        primary: true,
        modalSelected: "ModalValidCoupon"
    },
};

export const None = {
    args: {
        primary: true,
        modalSelected: "None"
    },
};