import { useMemo, useState } from 'react';
import {
  Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TablePagination, TextField, Box, Skeleton, Typography,
} from '@mui/material';

/**
 * Reusable data table with search, client-side pagination and skeleton loading.
 * columns: [{ key, label, render? }]
 */
export default function DataTable({ columns, rows, loading, searchKeys = [], actions, emptyMessage = 'No records found' }) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const filtered = useMemo(() => {
    if (!search.trim()) return rows;
    const term = search.toLowerCase();
    return rows.filter((row) =>
      (searchKeys.length ? searchKeys : columns.map((c) => c.key)).some((k) =>
        String(row[k] ?? '').toLowerCase().includes(term)
      )
    );
  }, [rows, search, searchKeys, columns]);

  const paged = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Paper>
      <Box sx={{ p: 2 }}>
        <TextField
          size="small" fullWidth placeholder="Search..." value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0); }}
          inputProps={{ 'aria-label': 'search table' }}
        />
      </Box>
      <TableContainer sx={{ maxHeight: 560 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              {columns.map((c) => <TableCell key={c.key} sx={{ fontWeight: 700 }}>{c.label}</TableCell>)}
              {actions && <TableCell sx={{ fontWeight: 700 }}>Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {columns.map((c) => <TableCell key={c.key}><Skeleton /></TableCell>)}
                    {actions && <TableCell><Skeleton /></TableCell>}
                  </TableRow>
                ))
              : paged.map((row) => (
                  <TableRow key={row.id} hover>
                    {columns.map((c) => (
                      <TableCell key={c.key}>{c.render ? c.render(row) : String(row[c.key] ?? '')}</TableCell>
                    ))}
                    {actions && <TableCell>{actions(row)}</TableCell>}
                  </TableRow>
                ))}
            {!loading && paged.length === 0 && (
              <TableRow>
                <TableCell colSpan={columns.length + (actions ? 1 : 0)}>
                  <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 3 }}>
                    {emptyMessage}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div" count={filtered.length} page={page} rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[10, 25, 50]}
        onPageChange={(_, p) => setPage(p)}
        onRowsPerPageChange={(e) => { setRowsPerPage(+e.target.value); setPage(0); }}
      />
    </Paper>
  );
}
