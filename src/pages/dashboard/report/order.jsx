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
import { useMerchant } from '../../../context/MerchantContext';

const statusColor = {
  Processed: 'success',
  Failed: 'error',
  Pending: 'warning',
  Processing: 'info'
};

export default function Order() {
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
  const [sortBy, setSortBy] = useState('creation');
  const [sortOrder, setSortOrder] = useState('desc');
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { role } = useMerchant();

  const API_URL = '/method/iswitch.admin_portal_api.get_orders';

  // Fetch orders from API
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const filterData = {
        status: status !== 'all' ? status : null,
        from_date: dateRange[0] ? dateRange[0].toISOString().slice(0, 16) : null,
        to_date: dateRange[1] ? dateRange[1].toISOString().slice(0, 16) : null
      };

      const requestData = {
        filter_data: JSON.stringify(filterData),
        page: page + 1,
        page_size: rowsPerPage,
        sort_by: sortBy,
        sort_order: sortOrder
      };

      const response = await apiPost(API_URL, requestData);

      if (response.success && response.data?.message) {
        setOrders(response.data.message.orders || []);
        setTotal(response.data.message.total || 0);
      } else {
        setError('Failed to fetch orders');
      }
    } catch (err) {
      setError(err.message || 'Error fetching orders');
      setOrders([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, rowsPerPage, status, dateRange, sortBy, sortOrder]);

  // Filter orders locally by search
  const filteredOrders = orders.filter((order) => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return (
      order.id?.toLowerCase().includes(searchLower) ||
      order.merchant_ref_id?.toLowerCase().includes(searchLower) ||
      order.merchant_name?.toLowerCase().includes(searchLower) ||
      order.customer?.toLowerCase().includes(searchLower) ||
      order.utr?.toLowerCase().includes(searchLower)
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
        Orders
      </Typography>

      {/* Filters Row */}
      <Box sx={{ mb: 3 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <TextField
            size="small"
            label="Search"
            placeholder="Search by ID, Merchant, Customer, UTR..."
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
            <MenuItem value="Processed">Processed</MenuItem>
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
                    <TableCell sx={{ fontWeight: 600 }}>ORDER ID</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>MERCHANT REF ID</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>MERCHANT NAME</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>CUSTOMER</TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="right">AMOUNT</TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="right">FEE</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>STATUS</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>UTR</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>DATE</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>MODIFIED</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => (
                      <TableRow hover key={order.id}>
                        <TableCell>{order.id}</TableCell>
                        <TableCell>{order.merchant_ref_id}</TableCell>
                        <TableCell>{order.merchant_name}</TableCell>
                        <TableCell>{order.customer || '-'}</TableCell>
                        <TableCell align="right">₹{order.amount?.toFixed(2)}</TableCell>
                        <TableCell align="right">₹{order.fee?.toFixed(2)}</TableCell>
                        <TableCell>
                          <Chip
                            label={order.status}
                            color={statusColor[order.status] || 'default'}
                            size="small"
                            sx={{ minWidth: 80 }}
                          />
                        </TableCell>
                        <TableCell>{order.utr || '-'}</TableCell>
                        <TableCell>{formatDate(order.date)}</TableCell>
                        <TableCell>{formatDate(order.modified)}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={10} align="center">
                        <Typography variant="body2" color="textSecondary" py={3}>
                          No orders found
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