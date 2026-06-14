import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSnackbar } from 'notistack';
import {
  Box, Typography, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, Checkbox, FormControlLabel, Stack, Alert, Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import DataTable from '../../../components/common/DataTable';
import ConfirmDialog from '../../../components/common/ConfirmDialog';
import { firestoreService } from '../../../services/firestoreService';
import { logAudit } from '../../../services/auditService';
import { entityConfigs } from '../entityConfigs';
import { validate } from '../../../utils/validators';
import { exportToExcel } from '../../reports/exportService';

/** Generic, config-driven CRUD page used by every admin master-data module. */
export default function EntityManagerPage({ entityKey }) {
  const config = entityConfigs[entityKey];
  const { enqueueSnackbar } = useSnackbar();
  const [rows, setRows] = useState([]);
  const [lookups, setLookups] = useState({});
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const [deleting, setDeleting] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await firestoreService.list(config.collection);
      setRows(data);
      const lookupCols = config.fields.filter((f) => f.type === 'lookup');
      const results = {};
      await Promise.all(lookupCols.map(async (f) => {
        results[f.key] = await firestoreService.list(f.lookup);
      }));
      setLookups(results);
    } catch (e) {
      enqueueSnackbar(e.message, { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [config, enqueueSnackbar]);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => {
    setEditing(null);
    setForm(Object.fromEntries(config.fields.map((f) => [f.key, f.type === 'checkbox' ? false : ''])));
    setErrors({});
    setFormOpen(true);
  };

  const openEdit = (row) => {
    setEditing(row);
    setForm({ ...row, permissions: Array.isArray(row.permissions) ? row.permissions.join(', ') : row.permissions });
    setErrors({});
    setFormOpen(true);
  };

  const handleSave = async () => {
    const schema = Object.fromEntries(config.fields.map((f) => [f.key, f.rules || []]));
    const { errors: errs, valid } = validate(form, schema);
    setErrors(errs);
    if (!valid) return;

    const payload = {};
    for (const f of config.fields) {
      let value = form[f.key];
      if (f.type === 'number') value = Number(value || 0);
      if (f.type === 'csv') value = String(value || '').split(',').map((s) => s.trim()).filter(Boolean);
      payload[f.key] = value;
      // denormalize the lookup label for fast list rendering
      if (f.type === 'lookup' && f.denormalize) {
        const valueField = f.lookupValue || 'id';
        const match = (lookups[f.key] || []).find((o) => o[valueField] === value || o.id === value);
        payload[f.denormalize] = match ? match[f.lookupLabel] : '';
      }
    }

    try {
      if (editing) {
        await firestoreService.update(config.collection, editing.id, payload);
        await logAudit({ action: 'UPDATE', entity: config.collection, entityId: editing.id, before: editing, after: payload });
        enqueueSnackbar(`${config.title} updated`, { variant: 'success' });
      } else if (config.idField) {
        await firestoreService.set(config.collection, payload[config.idField], payload);
        await logAudit({ action: 'CREATE', entity: config.collection, entityId: payload[config.idField], after: payload });
        enqueueSnackbar(`${config.title} created`, { variant: 'success' });
      } else {
        const id = await firestoreService.create(config.collection, payload);
        await logAudit({ action: 'CREATE', entity: config.collection, entityId: id, after: payload });
        enqueueSnackbar(`${config.title} created`, { variant: 'success' });
      }
      setFormOpen(false);
      load();
    } catch (e) {
      enqueueSnackbar(e.message, { variant: 'error' });
    }
  };

  const handleDelete = async () => {
    try {
      await firestoreService.remove(config.collection, deleting.id);
      await logAudit({ action: 'DELETE', entity: config.collection, entityId: deleting.id, before: deleting });
      enqueueSnackbar('Deleted', { variant: 'success' });
      setDeleting(null);
      load();
    } catch (e) {
      enqueueSnackbar(e.message, { variant: 'error' });
    }
  };

  const searchKeys = useMemo(() => config.columns.map((c) => c.key), [config]);

  return (
    <Box>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} sx={{ mb: 2 }} spacing={1}>
        <Typography variant="h4">{config.title}</Typography>
        <Stack direction="row" spacing={1}>
          <Button startIcon={<DownloadIcon />} onClick={() => exportToExcel(rows, config.columns, config.title)}>Export</Button>
          <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>Add</Button>
        </Stack>
      </Stack>
      {config.note && <Alert severity="info" sx={{ mb: 2 }}>{config.note}</Alert>}

      <DataTable
        columns={config.columns}
        rows={rows}
        loading={loading}
        searchKeys={searchKeys}
        actions={(row) => (
          <>
            <Tooltip title="Edit"><IconButton size="small" onClick={() => openEdit(row)}><EditIcon fontSize="small" /></IconButton></Tooltip>
            <Tooltip title="Delete"><IconButton size="small" color="error" onClick={() => setDeleting(row)}><DeleteIcon fontSize="small" /></IconButton></Tooltip>
          </>
        )}
      />

      <Dialog open={formOpen} onClose={() => setFormOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editing ? 'Edit' : 'Add'} {config.title}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            {config.fields.map((f) => {
              if (f.type === 'checkbox') {
                return (
                  <FormControlLabel
                    key={f.key}
                    control={<Checkbox checked={!!form[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.checked })} />}
                    label={f.label}
                  />
                );
              }
              if (f.type === 'select') {
                return (
                  <TextField key={f.key} select fullWidth label={f.label} value={form[f.key] ?? ''}
                    error={!!errors[f.key]} helperText={errors[f.key]}
                    onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}>
                    {f.options.map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                  </TextField>
                );
              }
              if (f.type === 'lookup') {
                const valueField = f.lookupValue || 'id';
                return (
                  <TextField key={f.key} select fullWidth label={f.label} value={form[f.key] ?? ''}
                    error={!!errors[f.key]} helperText={errors[f.key]}
                    onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}>
                    {(lookups[f.key] || []).map((o) => (
                      <MenuItem key={o.id} value={o[valueField]}>{o[f.lookupLabel]}</MenuItem>
                    ))}
                  </TextField>
                );
              }
              return (
                <TextField key={f.key} fullWidth label={f.label}
                  type={f.type === 'number' ? 'number' : f.type === 'date' ? 'date' : 'text'}
                  InputLabelProps={f.type === 'date' ? { shrink: true } : undefined}
                  value={form[f.key] ?? ''}
                  disabled={editing && f.immutable}
                  error={!!errors[f.key]} helperText={errors[f.key]}
                  onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                />
              );
            })}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFormOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={!!deleting}
        title="Confirm Deletion"
        message={`Delete this ${config.title.toLowerCase().replace(/s$/, '')}? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </Box>
  );
}
