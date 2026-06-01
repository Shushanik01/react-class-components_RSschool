import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Flyout from './Flyout';

describe('Flyout', () => {
  it('renders nothing when selectedCount is 0', () => {
    const { container } = render(
      <Flyout selectedCount={0} onUnselectAll={vi.fn()} onDownload={vi.fn()} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('renders when selectedCount is greater than 0', () => {
    render(
      <Flyout selectedCount={3} onUnselectAll={vi.fn()} onDownload={vi.fn()} />
    );
    expect(screen.getByText('3 items selected')).toBeInTheDocument();
  });

  it('uses singular "item" when count is 1', () => {
    render(
      <Flyout selectedCount={1} onUnselectAll={vi.fn()} onDownload={vi.fn()} />
    );
    expect(screen.getByText('1 item selected')).toBeInTheDocument();
  });

  it('renders "Unselect all" and "Download" buttons', () => {
    render(
      <Flyout selectedCount={2} onUnselectAll={vi.fn()} onDownload={vi.fn()} />
    );
    expect(screen.getByText('Unselect all')).toBeInTheDocument();
    expect(screen.getByText('Download')).toBeInTheDocument();
  });

  it('calls onUnselectAll when "Unselect all" is clicked', async () => {
    const onUnselectAll = vi.fn();
    render(
      <Flyout
        selectedCount={2}
        onUnselectAll={onUnselectAll}
        onDownload={vi.fn()}
      />
    );
    await userEvent.click(screen.getByText('Unselect all'));
    expect(onUnselectAll).toHaveBeenCalledTimes(1);
  });

  it('calls onDownload when "Download" is clicked', async () => {
    const onDownload = vi.fn();
    render(
      <Flyout
        selectedCount={2}
        onUnselectAll={vi.fn()}
        onDownload={onDownload}
      />
    );
    await userEvent.click(screen.getByText('Download'));
    expect(onDownload).toHaveBeenCalledTimes(1);
  });

  it('does not call onDownload when "Unselect all" is clicked', async () => {
    const onDownload = vi.fn();
    render(
      <Flyout
        selectedCount={2}
        onUnselectAll={vi.fn()}
        onDownload={onDownload}
      />
    );
    await userEvent.click(screen.getByText('Unselect all'));
    expect(onDownload).not.toHaveBeenCalled();
  });
});
