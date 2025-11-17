// Jest setup file for React Native testing

// Mock PanResponder
jest.doMock('react-native', () => ({
  ...jest.requireActual('react-native'),
  PanResponder: {
    create: () => ({
      panHandlers: {
        onStartShouldSetResponder: () => false,
        onMoveShouldSetResponder: () => false,
        onResponderGrant: () => {},
        onResponderMove: () => {},
        onResponderRelease: () => {},
      },
    }),
  },
}));

// Suppress console warnings in tests
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    const message = typeof args[0] === 'string' ? args[0] : '';

    // Suppress React Native testing warnings
    if (
      message.includes('Warning: ReactDOM.render') ||
      message.includes('Warning: useLayoutEffect') ||
      message.includes('You provided a `value` prop to a form field') ||
      message.includes('React does not recognize the') ||
      message.includes('prop on a DOM element') ||
      (message.includes('Received') && message.includes('non-boolean attribute')) ||
      message.includes('horizontal') ||
      message.includes('showsHorizontalScrollIndicator') ||
      message.includes('Unknown event handler property')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
