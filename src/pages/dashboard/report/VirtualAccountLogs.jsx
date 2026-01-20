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
import { apiPost } from '../../../api/http';
import { API_URLS } from '../../../api/apiUrl';
import { useMerchant } from '../../../context/MerchantContext';


const statusColor = {
  Success: 'success',
  Failed: 'error',
  Pending: 'warning',
  Processing: 'info'
};

const typeColor = {
  Credit: 'success',
  Debit: 'error'
};

export default function VirtualAccountLogs() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
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
  const [logs, setLogs] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { role } = useMerchant();
  let url = ''
  if (role == 'user') {
    url = API_URLS.merchant.vanlog.vanlog
  }

  if (role == 'admin') {
    url = API_URLS.admin.vanlog.vanlog
  }
  // Fetch VAN logs from API
  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError(null);

      const filterData = {
        status: status !== 'all' ? status : null,
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
        setLogs(response.data.message.logs || []);
        setTotal(response.data.message.total || 0);
      } else {
        setError('Failed to fetch virtual account logs');
      }
    } catch (err) {
      setError(err.message || 'Error fetching virtual account logs');
      setLogs([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page, rowsPerPage, status, dateRange]);

  // Filter logs locally by search
  const filteredLogs = logs.filter((log) => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return (
      log.id?.toLowerCase().includes(searchLower) ||
      log.account_number?.toLowerCase().includes(searchLower) ||
      log.utr?.toLowerCase().includes(searchLower) ||
      log.remitter_name?.toLowerCase().includes(searchLower) ||
      log.merchant?.toLowerCase().includes(searchLower)
    );
  });

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
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
        Virtual Account Logs
      </Typography>

      {/* Filters Row */}
      <Box sx={{ mb: 3 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <TextField
            size="small"
            label="Search"
            placeholder="Search by ID, Account, UTR, Merchant..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ minWidth: 250 }}
          />

          <TextField
            select
            size="small"
            label="Status"
            value={status}
            onChange={handleStatusChange}
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="Success">Success</MenuItem>
            <MenuItem value="Failed">Failed</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Processing">Processing</MenuItem>
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
              <Table sx={{ minWidth: 1200 }}>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                    <TableCell sx={{ fontWeight: 600 }}>TXN ID</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>ACCOUNT NUMBER</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>TYPE</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>UTR</TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="right">AMOUNT</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>STATUS</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>REMITTER NAME</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>REMITTER A/C</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>IFSC</TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="right">OPENING BAL</TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="right">CLOSING BAL</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>MERCHANT</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>DATE</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {filteredLogs.length > 0 ? (
                    filteredLogs.map((log) => (
                      <TableRow hover key={log.id}>
                        <TableCell>{log.id}</TableCell>
                        <TableCell>{log.account_number}</TableCell>
                        <TableCell>
                          <Chip
                            label={log.type}
                            color={typeColor[log.type] || 'default'}
                            size="small"
                            sx={{ minWidth: 60 }}
                          />
                        </TableCell>
                        <TableCell sx={{ maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {log.utr || '-'}
                        </TableCell>
                        <TableCell align="right">₹{log.amount?.toFixed(2)}</TableCell>
                        <TableCell>
                          <Chip
                            label={log.status}
                            color={statusColor[log.status] || 'default'}
                            size="small"
                            sx={{ minWidth: 80 }}
                          />
                        </TableCell>
                        <TableCell>{log.remitter_name || '-'}</TableCell>
                        <TableCell>{log.remitter_account_number || '-'}</TableCell>
                        <TableCell>{log.remitter_ifsc_code || '-'}</TableCell>
                        <TableCell align="right">₹{log.opening_balance?.toFixed(2)}</TableCell>
                        <TableCell align="right">₹{log.closing_balance?.toFixed(2)}</TableCell>
                        <TableCell>{log.merchant || '-'}</TableCell>
                        <TableCell>{formatDate(log.date)}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={13} align="center">
                        <Typography variant="body2" color="textSecondary" py={3}>
                          No virtual account logs found
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