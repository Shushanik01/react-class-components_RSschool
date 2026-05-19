import { render, screen } from '@testing-library/react';
import About from '../pages/AboutPage/About';

describe('About', () => {
  it('renders the author heading', () => {
    render(<About />);
    expect(screen.getByText(/about the author/i)).toBeInTheDocument();
  });

  it('renders the author name', () => {
    render(<About />);
    expect(screen.getByText(/shushanik/i)).toBeInTheDocument();
  });

  it('renders the GitHub icon image', () => {
    render(<About />);
    expect(screen.getByAltText(/github icon/i)).toBeInTheDocument();
  });

  it('renders the LinkedIn image', () => {
    render(<About />);
    expect(screen.getByAltText(/linkedin/i)).toBeInTheDocument();
  });

  it('renders the portfolio link', () => {
    render(<About />);
    expect(
      screen.getByRole('link', { name: /view my portfolio/i })
    ).toBeInTheDocument();
  });

  it('renders the RS School link', () => {
    render(<About />);
    expect(
      screen.getByRole('link', { name: /rs school/i })
    ).toBeInTheDocument();
  });
});
