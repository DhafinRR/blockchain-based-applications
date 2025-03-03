import { render, screen } from '@testing-library/react';
import App from '../App';

test('renders farmer registry component', () => {
  render(<App />);
  const farmerRegistryElement = screen.getByText(/Registrasi Petani/i);
  expect(farmerRegistryElement).toBeInTheDocument();
});