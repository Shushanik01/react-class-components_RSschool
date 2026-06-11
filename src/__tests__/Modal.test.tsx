import { render, screen, fireEvent } from '@testing-library/react';
import { Modal } from '../components/modal/modal';

describe('Modal', () => {
  let portal: HTMLDivElement;

  beforeEach(() => {
    portal = document.createElement('div');
    portal.id = 'portal';
    document.body.appendChild(portal);
  });

  afterEach(() => {
    portal.remove();
  });

  it('renders nothing when isOpen is false', () => {
    render(
      <Modal isOpen={false} onClose={vi.fn()}>
        Modal content
      </Modal>
    );
    expect(screen.queryByText('Modal content')).not.toBeInTheDocument();
  });

  it('renders children when isOpen is true', () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()}>
        Modal content
      </Modal>
    );
    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  it('renders via portal into the #portal element', () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()}>
        Portal content
      </Modal>
    );
    expect(portal).toContainElement(screen.getByText('Portal content'));
  });

  it('dialog has aria-modal="true" for accessibility', () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()}>
        content
      </Modal>
    );
    const dialog = portal.querySelector('[aria-modal="true"]');
    expect(dialog).toBeInTheDocument();
  });

  it('renders close button with accessible label', () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()}>
        content
      </Modal>
    );
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={onClose}>
        content
      </Modal>
    );
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when Escape key is pressed', () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={onClose}>
        content
      </Modal>
    );
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose for non-Escape keys', () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={onClose}>
        content
      </Modal>
    );
    fireEvent.keyDown(document, { key: 'Enter' });
    expect(onClose).not.toHaveBeenCalled();
  });

  it('calls onClose when the backdrop is clicked', () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={onClose}>
        content
      </Modal>
    );
    const backdrop = portal.firstElementChild as HTMLElement;
    fireEvent.click(backdrop);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose when the dialog itself is clicked', () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={onClose}>
        content
      </Modal>
    );
    const dialog = portal.querySelector('[aria-modal="true"]') as HTMLElement;
    fireEvent.click(dialog);
    expect(onClose).not.toHaveBeenCalled();
  });

  it('does not render when portal element does not exist', () => {
    portal.remove();
    render(
      <Modal isOpen={true} onClose={vi.fn()}>
        orphan content
      </Modal>
    );
    expect(screen.queryByText('orphan content')).not.toBeInTheDocument();
    // Re-add portal so afterEach cleanup does not throw
    document.body.appendChild(portal);
  });
});
