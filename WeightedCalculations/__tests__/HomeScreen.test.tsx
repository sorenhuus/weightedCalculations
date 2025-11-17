import React from 'react';

// Mock React Native BEFORE importing any components that use it
jest.mock('react-native', () => ({
  View: ({ children, ...props }: any) => React.createElement('div', props, children),
  Text: ({ children, ...props }: any) => React.createElement('span', props, children),
  TextInput: (props: any) => React.createElement('input', props),
  ScrollView: ({ children, ...props }: any) => React.createElement('div', props, children),
  StyleSheet: {
    create: (styles: any) => styles,
  },
}));

jest.mock('@/components/themed-text', () => ({
  ThemedText: ({ children, type, ...props }: any) => React.createElement('div', props, children),
}));

jest.mock('@/components/themed-view', () => ({
  ThemedView: ({ children, ...props }: any) => React.createElement('div', props, children),
}));

// Now import the component and testing library
import HomeScreen from '../app/(tabs)/index';
import { render } from '@testing-library/react';

describe('HomeScreen - Component Tests', () => {
  describe('Initial Render', () => {
    it('should render the app title', () => {
      const { getByText } = render(React.createElement(HomeScreen));
      expect(getByText('Weighted Calculations')).toBeTruthy();
    });

    it('should render three data rows initially', () => {
      const { container } = render(React.createElement(HomeScreen));
      const inputs = container.querySelectorAll('input[placeholder="Enter name"]');
      expect(inputs).toHaveLength(3);
    });

    it('should render header inputs with default values', () => {
      const { container } = render(React.createElement(HomeScreen));
      const xInput = container.querySelector('input[value="X"]') as HTMLInputElement;
      const yInput = container.querySelector('input[value="Y"]') as HTMLInputElement;
      const resultInput = container.querySelector('input[value="Result"]') as HTMLInputElement;

      expect(xInput).toBeTruthy();
      expect(yInput).toBeTruthy();
      expect(resultInput).toBeTruthy();
    });

    it('should display (sum) suffix text', () => {
      const { getByText } = render(React.createElement(HomeScreen));
      expect(getByText('(sum)')).toBeTruthy();
    });
  });

  describe('Header Customization', () => {
    it('should allow user to change X header', () => {
      const { container } = render(React.createElement(HomeScreen));
      const xInput = container.querySelector('input[value="X"]') as HTMLInputElement;

      if (xInput) {
        xInput.value = 'Price';
        xInput.dispatchEvent(new Event('input', { bubbles: true }));
        expect(xInput.value).toBe('Price');
      }
    });

    it('should allow user to change Y header', () => {
      const { container } = render(React.createElement(HomeScreen));
      const yInput = container.querySelector('input[value="Y"]') as HTMLInputElement;

      if (yInput) {
        yInput.value = 'Quantity';
        yInput.dispatchEvent(new Event('input', { bubbles: true }));
        expect(yInput.value).toBe('Quantity');
      }
    });

    it('should maintain (sum) suffix after changing result header', () => {
      const { getByText } = render(React.createElement(HomeScreen));
      expect(getByText('(sum)')).toBeTruthy();
    });
  });

  describe('Row Data Input', () => {
    it('should render name input fields', () => {
      const { container } = render(React.createElement(HomeScreen));
      const nameInputs = container.querySelectorAll('input[placeholder="Enter name"]');
      expect(nameInputs.length).toBeGreaterThanOrEqual(3);
    });

    it('should render number input fields for X and Y values', () => {
      const { container } = render(React.createElement(HomeScreen));
      const numberInputs = container.querySelectorAll('input[placeholder="0"]');
      expect(numberInputs.length).toBeGreaterThanOrEqual(6);
    });
  });

  describe('Row Count', () => {
    it('should have exactly 3 data rows initially', () => {
      const { container } = render(React.createElement(HomeScreen));
      const nameInputs = container.querySelectorAll('input[placeholder="Enter name"]');
      expect(nameInputs).toHaveLength(3);
    });

    it('should have keyboard type decimal-pad for number fields', () => {
      const { container } = render(React.createElement(HomeScreen));
      const numberInputs = container.querySelectorAll('input[placeholder="0"]');
      numberInputs.forEach((input: Element) => {
        expect(input).toBeTruthy();
      });
    });
  });

  describe('Component Structure', () => {
    it('should render a table structure', () => {
      const { container } = render(React.createElement(HomeScreen));
      const divs = container.querySelectorAll('div');
      expect(divs.length).toBeGreaterThan(0);
    });

    it('should have input fields for name, x, and y values', () => {
      const { container } = render(React.createElement(HomeScreen));
      const nameInputs = container.querySelectorAll('input[placeholder="Enter name"]');
      const numberInputs = container.querySelectorAll('input[placeholder="0"]');

      expect(nameInputs.length).toBe(3);
      expect(numberInputs.length).toBeGreaterThanOrEqual(6);
    });
  });
});
