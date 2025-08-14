import { render, screen } from '@testing-library/react';
import App from './app';

describe('App', () => {
  test('renders without crashing', () => {
    render(<App />);
  });
});
