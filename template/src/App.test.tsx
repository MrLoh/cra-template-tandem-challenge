import { render, screen } from '@testing-library/react';
import App from './App';

test('renders welcome message', () => {
  render(<App />);
  const welcome = screen.getByText('Welcome to the Tandem Code Challenge');
  expect(welcome).toBeInTheDocument();
});
