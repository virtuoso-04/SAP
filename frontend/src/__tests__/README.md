# EventMate Frontend Testing

This directory contains tests for the EventMate frontend components.

## Testing Setup

We use the following tools for testing:

- **Jest**: JavaScript testing framework
- **React Testing Library**: For testing React components
- **Jest DOM**: Custom matchers for DOM testing

## Running Tests

You can run tests using the following npm scripts:

```bash
# Run all tests
npm test

# Run only component tests
npm run test:components

# Run tests with coverage report
npm run test:coverage
```

## Test Structure

Tests are organized by component type:

- `__tests__/components/`: Tests for React components
- `__tests__/pages/`: Tests for page components
- `__tests__/hooks/`: Tests for custom hooks
- `__tests__/utils/`: Tests for utility functions

## Mocking

We use Jest's mocking capabilities to mock:

- External dependencies
- Framer Motion animations
- Network requests
- Images and other static files

## Writing Tests

When writing tests, follow these guidelines:

1. Test component rendering
2. Test user interactions
3. Test state changes
4. Test edge cases and error handling
5. Keep tests focused and isolated

## Testing UI Components

For UI components, focus on:

- Proper rendering of elements
- Correct handling of props
- User interactions (clicks, inputs, etc.)
- Accessibility concerns

## Example

```jsx
import { render, screen, fireEvent } from '@testing-library/react';
import MyComponent from './MyComponent';

test('renders correctly', () => {
  render(<MyComponent />);
  expect(screen.getByText('Hello World')).toBeInTheDocument();
});

test('button click works', () => {
  const handleClick = jest.fn();
  render(<MyComponent onClick={handleClick} />);
  
  fireEvent.click(screen.getByRole('button'));
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

## Coverage Reports

Coverage reports are generated in the `coverage/` directory when running `npm run test:coverage`. Aim for high test coverage, but focus on meaningful tests rather than just hitting coverage targets.