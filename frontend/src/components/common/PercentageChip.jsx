import { Chip } from '@mui/material';
import { categorize } from '../../utils/attendance';

export default function PercentageChip({ value }) {
  const category = categorize(value);
  return (
    <Chip
      size="small"
      label={`${value}% · ${category.label}`}
      sx={{ bgcolor: category.color, color: '#fff', fontWeight: 600 }}
    />
  );
}
