import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Pagination from '../components/pagination/Pagination';

const onPageChange = vi.fn();

describe('Pagination', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders Previous and Next buttons', () => {
    render(
      <Pagination currentPage={1} totalPages={5} onPageChange={onPageChange} />
    );
    expect(
      screen.getByRole('button', { name: /previous/i })
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
  });

  it('renders page numbers', () => {
    render(
      <Pagination currentPage={1} totalPages={5} onPageChange={onPageChange} />
    );
    expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '5' })).toBeInTheDocument();
  });

  it('disables Previous button on first page', () => {
    render(
      <Pagination currentPage={1} totalPages={5} onPageChange={onPageChange} />
    );
    expect(screen.getByRole('button', { name: /previous/i })).toBeDisabled();
  });

  it('disables Next button on last page', () => {
    render(
      <Pagination currentPage={5} totalPages={5} onPageChange={onPageChange} />
    );
    expect(screen.getByRole('button', { name: /next/i })).toBeDisabled();
  });

  it('calls onPageChange with decremented page when Previous is clicked', async () => {
    const user = userEvent.setup();
    render(
      <Pagination currentPage={3} totalPages={5} onPageChange={onPageChange} />
    );
    await user.click(screen.getByRole('button', { name: /previous/i }));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('calls onPageChange with incremented page when Next is clicked', async () => {
    const user = userEvent.setup();
    render(
      <Pagination currentPage={3} totalPages={5} onPageChange={onPageChange} />
    );
    await user.click(screen.getByRole('button', { name: /next/i }));
    expect(onPageChange).toHaveBeenCalledWith(4);
  });

  it('calls onPageChange with page number when a page button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <Pagination currentPage={1} totalPages={5} onPageChange={onPageChange} />
    );
    await user.click(screen.getByRole('button', { name: '3' }));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });
});
