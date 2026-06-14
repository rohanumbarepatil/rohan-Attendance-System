import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DataTable from '../components/common/DataTable';

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'code', label: 'Code' },
];
const rows = [
  { id: '1', name: 'Computer Science', code: 'CS' },
  { id: '2', name: 'Mechanical', code: 'ME' },
];

describe('DataTable component', () => {
  it('renders rows and headers', () => {
    render(<DataTable columns={columns} rows={rows} loading={false} />);
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Computer Science')).toBeInTheDocument();
    expect(screen.getByText('Mechanical')).toBeInTheDocument();
  });

  it('filters rows via search', async () => {
    render(<DataTable columns={columns} rows={rows} loading={false} searchKeys={['name']} />);
    await userEvent.type(screen.getByPlaceholderText('Search...'), 'mech');
    expect(screen.queryByText('Computer Science')).not.toBeInTheDocument();
    expect(screen.getByText('Mechanical')).toBeInTheDocument();
  });

  it('shows an empty message when no rows match', () => {
    render(<DataTable columns={columns} rows={[]} loading={false} emptyMessage="Nothing here" />);
    expect(screen.getByText('Nothing here')).toBeInTheDocument();
  });
});
