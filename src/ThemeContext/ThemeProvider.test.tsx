import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from './ThemeProvider';
import { useTheme } from './context';

const TestConsumer = () => {
  const { theme, handleThemeChange } = useTheme();
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <button onClick={handleThemeChange}>Toggle</button>
    </div>
  );
};

describe('ThemeProvider', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  it('provides Light theme by default', () => {
    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>
    );
    expect(screen.getByTestId('theme')).toHaveTextContent('Light');
  });

  it('reads initial theme from localStorage', () => {
    localStorage.setItem('selectedTheme', 'Dark');
    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>
    );
    expect(screen.getByTestId('theme')).toHaveTextContent('Dark');
  });

  it('toggles from Light to Dark', async () => {
    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>
    );
    await userEvent.click(screen.getByText('Toggle'));
    expect(screen.getByTestId('theme')).toHaveTextContent('Dark');
  });

  it('toggles from Dark back to Light', async () => {
    localStorage.setItem('selectedTheme', 'Dark');
    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>
    );
    await userEvent.click(screen.getByText('Toggle'));
    expect(screen.getByTestId('theme')).toHaveTextContent('Light');
  });

  it('sets data-theme attribute on documentElement', () => {
    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>
    );
    expect(document.documentElement).toHaveAttribute('data-theme', 'Light');
  });

  it('updates data-theme attribute when theme changes', async () => {
    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>
    );
    await userEvent.click(screen.getByText('Toggle'));
    expect(document.documentElement).toHaveAttribute('data-theme', 'Dark');
  });

  it('persists theme to localStorage on change', async () => {
    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>
    );
    await userEvent.click(screen.getByText('Toggle'));
    expect(localStorage.getItem('selectedTheme')).toBe('Dark');
  });
});
