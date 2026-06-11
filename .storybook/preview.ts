import React from 'react';
import { ApplicationDecorator } from './decorators/ApplicationDecorator';

export const decorators = [Story => <ApplicationDecorator><Story /></ApplicationDecorator>];

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
};
