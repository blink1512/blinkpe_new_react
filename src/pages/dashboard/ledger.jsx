import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  CircularProgress,
  Alert,
  Paper,
  Stack,
  Popover,
  Button,
  IconButton
} from '@mui/material';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { apiPost } from '../../api/http';
import { useMerchant } from '../../context/MerchantContext';
import { API_URLS } from '../../api/apiUrl';


const typeColor = {
  Debit: 'error',
  Credit: 'success'
};

export default function Ledger() {
  const [search, setSearch] = useState('');
  const [type, setType] = useState('all');
  const [dateRange, setDateRange] = useState([null, null]);
  const [dateRangeState, setDateRangeState] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection'
    }
  ]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [entries, setEntries] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { role } = useMerchant();

  let url = ''
  if (role == 'user') {
    url = API_URLS.merchant.ledger.ledger
  }

  // Fetch ledger entries from API
  const fetchEntries = async () => {
    try {
      setLoading(true);
      setError(null);

      const filterData = {
        type: type !== 'all' ? type : null,
        from_date: dateRange[0] ? dateRange[0].toISOString() : null,
        to_date: dateRange[1] ? dateRange[1].toISOString() : null
      };

      const requestData = {
        filter_data: JSON.stringify(filterData),
        page: page + 1,
        page_size: rowsPerPage
      };


      const response = await apiPost(
        url,
        requestData
      );

      if (response.success && response.data?.message) {
        setEntries(response.data.message.entries || []);
        setTotal(response.data.message.total || 0);
      } else {
        setError('Failed to fetch ledger entries');
      }
    } catch (err) {
      setError(err.message || 'Error fetching ledger entries');
      setEntries([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, [page, rowsPerPage, type, dateRange]);

  // Filter entries locally by search
  const filteredEntries = entries.filter((entry) => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return (
      entry.id?.toLowerCase().includes(searchLower) ||
      entry.order_id?.toLowerCase().includes(searchLower)
    );
  });

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleTypeChange = (e) => {
    setType(e.target.value);
    setPage(0);
  };

  const handleDateRangeClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDateRangeClose = () => {
    setAnchorEl(null);
  };

  const handleDateRangeChange = (item) => {
    setDateRangeState([item.selection]);
  };

  const handleApplyDateRange = () => {
    setDateRange([
      dateRangeState[0].startDate,
      dateRangeState[0].endDate
    ]);
    setPage(0);
    handleDateRangeClose();
  };

  const handleClearDateRange = () => {
    setDateRange([null, null]);
    setDateRangeState([
      {
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection'
      }
    ]);
    setPage(0);
  };

  const formatDateRange = () => {
    if (!dateRange[0] || !dateRange[1]) return 'Select Date Range';
    const start = dateRange[0].toLocaleDateString('en-GB');
    const end = dateRange[1].toLocaleDateString('en-GB');
    return `${start} - ${end}`;
  };

  const open = Boolean(anchorEl);

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      {/* Page Header */}
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        Ledger Entries
      </Typography>

      {/* Filters Row */}
      <Box sx={{ mb: 3 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <TextField
            size="small"
            label="Search"
            placeholder="Search by Entry ID or Order ID"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ minWidth: 200 }}
          />

          <TextField
            select
            size="small"
            label="Type"
            value={type}
            onChange={handleTypeChange}
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="Debit">Debit</MenuItem>
            <MenuItem value="Credit">Credit</MenuItem>
          </TextField>

          <Box sx={{ position: 'relative', minWidth: 280 }}>
            <TextField
              size="small"
              label="Date Range"
              value={formatDateRange()}
              onClick={handleDateRangeClick}
              InputProps={{
                readOnly: true,
                startAdornment: (
                  <span style={{ marginRight: '8px', color: '#666' }}>📅</span>
                ),
                endAdornment: dateRange[0] && dateRange[1] && (
                  <IconButton size="small" onClick={handleClearDateRange}>
                    <span style={{ fontSize: '16px' }}>✖</span>
                  </IconButton>
                ),
              }}
              sx={{
                minWidth: 280,
                cursor: 'pointer',
                '& .MuiInputBase-input': {
                  cursor: 'pointer'
                }
              }}
            />

            <Popover
              open={open}
              anchorEl={anchorEl}
              onClose={handleDateRangeClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
            >
              <Box sx={{ p: 2 }}>
                <DateRangePicker
                  ranges={dateRangeState}
                  onChange={handleDateRangeChange}
                  months={2}
                  direction="horizontal"
                  showSelectionPreview={true}
                  moveRangeOnFirstSelection={false}
                />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
                  <Button size="small" onClick={handleDateRangeClose}>
                    Cancel
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    onClick={handleApplyDateRange}
                  >
                    Apply
                  </Button>
                </Box>
              </Box>
            </Popover>
          </Box>
        </Stack>
      </Box>

      {/* Error Alert */}
      {error && (
        <Box sx={{ mb: 2 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      )}

      {/* Table Section */}
      <Paper elevation={0} sx={{ width: '100%', border: '1px solid #e0e0e0' }}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" p={4}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                    <TableCell sx={{ fontWeight: 600 }}>ENTRY ID</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>ORDER ID</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>TYPE</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>DATE</TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="right">TRANSACTION AMOUNT</TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="right">OPENING BALANCE</TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="right">CLOSING BALANCE</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {filteredEntries.length > 0 ? (
                    filteredEntries.map((entry) => (
                      <TableRow hover key={entry.id}>
                        <TableCell>{entry.id}</TableCell>
                        <TableCell>{entry.order_id}</TableCell>
                        <TableCell>
                          <Chip
                            label={entry.type}
                            color={typeColor[entry.type] || 'default'}
                            size="small"
                            sx={{ minWidth: 70 }}
                          />
                        </TableCell>
                        <TableCell>{formatDate(entry.date)}</TableCell>
                        <TableCell align="right">₹{entry.transaction_amount?.toFixed(2)}</TableCell>
                        <TableCell align="right">₹{entry.opening_balance?.toFixed(2)}</TableCell>
                        <TableCell align="right">₹{entry.closing_balance?.toFixed(2)}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        <Typography variant="body2" color="textSecondary" py={3}>
                          No ledger entries found
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ borderTop: '1px solid #e0e0e0' }}>
              <TablePagination
                component="div"
                count={total}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[10, 20, 50, 100]}
                labelRowsPerPage="Rows per page:"
              />
            </Box>
          </>
        )}
      </Paper>
    </Box>
  );
}