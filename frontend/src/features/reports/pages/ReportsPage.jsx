import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import {
  Box, Typography, Card, CardContent, Stack, TextField, MenuItem, Button,
} from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TableViewIcon from '@mui/icons-material/TableView';
import dayjs from 'dayjs';
import DataTable from '../../../components/common/DataTable';
import PercentageChip from '../../../components/common/PercentageChip';
import { reportService } from '../reportService';
import { exportToPdf, exportToExcel } from '../exportService';

const PERIOD_OPTIONS = ['DAILY', 'WEEKLY', 'MONTHLY', 'SEMESTER', 'YEARLY'];

const columns = [
  { key: 'rollNumber', label: 'Roll No.' },
  { key: 'name', label: 'Name' },
  { key: 'total', label: 'Conducted' },
  { key: 'attended', label: 'Attended' },
  { key: 'absent', label: 'Absent' },
  { key: 'late', label: 'Late' },
  { key: 'leave', label: 'Leave' },
  { key: 'percentage', label: 'Percentage', render: (r) => <PercentageChip value={r.percentage} /> },
  { key: 'category', label: 'Category' },
];

const exportColumns = columns.map(({ key, label }) => ({ key, label }));

export default function ReportsPage() {
  const { enqueueSnackbar } = useSnackbar();
  const { user, profile } = useSelector((s) => s.auth);
  const [period, setPeriod] = useState('MONTHLY');
  const [referenceDate, setReferenceDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);

  const generate = async () => {
    setLoading(true);
    try {
      const data = await reportService.buildReport({
        period, referenceDate, role: profile.role, userId: user.uid,
      });
      setRows(data);
      setGenerated(true);
    } catch (e) {
      enqueueSnackbar(e.message, { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const doExport = async (format) => {
    const title = `${period} Attendance Report (${referenceDate})`;
    if (format === 'PDF') exportToPdf(rows, exportColumns, title);
    else exportToExcel(rows, exportColumns, title);
    await reportService.recordReport({
      period, generatedBy: user.uid, rowCount: rows.length, format,
      studentUserId: profile.role === 'STUDENT' ? user.uid : '',
    });
    enqueueSnackbar(`${format} report downloaded`, { variant: 'success' });
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Attendance Reports</Typography>
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }}>
            <TextField select label="Report Period" value={period} sx={{ minWidth: 180 }}
              onChange={(e) => setPeriod(e.target.value)}>
              {PERIOD_OPTIONS.map((p) => <MenuItem key={p} value={p}>{p}</MenuItem>)}
            </TextField>
            <TextField type="date" label="Reference Date" InputLabelProps={{ shrink: true }}
              value={referenceDate} onChange={(e) => setReferenceDate(e.target.value)} />
            <Button variant="contained" onClick={generate} disabled={loading}>Generate</Button>
            {generated && rows.length > 0 && (
              <>
                <Button startIcon={<PictureAsPdfIcon />} onClick={() => doExport('PDF')}>PDF</Button>
                <Button startIcon={<TableViewIcon />} onClick={() => doExport('EXCEL')}>Excel</Button>
              </>
            )}
          </Stack>
        </CardContent>
      </Card>
      {generated && (
        <DataTable columns={columns} rows={rows} loading={loading}
          searchKeys={['name', 'rollNumber', 'category']}
          emptyMessage="No attendance data for the selected period" />
      )}
    </Box>
  );
}
