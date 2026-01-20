import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
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
  Card,
  CardContent,
  Grid
} from '@mui/material';
import { apiGet } from '../../api/http';
import { useMerchant } from '../../context/MerchantContext';


export default function Processors() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [processors, setProcessors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { role } = useMerchant();

  // Determine API URL based on role
  const getApiUrl = () => {
    if (role === 'admin') {
      return '/method/iswitch.admin_portal_api.get_processors';
    }
    return '';
  };

  // Fetch processors from API
  const fetchProcessors = async () => {
    const url = getApiUrl();
    
    if (!url) {
      console.log('No URL available, waiting for role...');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await apiGet(url);

      if (response.success && response.data?.message?.processors) {
        setProcessors(response.data.message.processors);
      } else {
        setError('Failed to fetch processors');
      }
    } catch (err) {
      setError(err.message || 'Error fetching processors');
      setProcessors([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch when role is available
  useEffect(() => {
    if (role) {
      fetchProcessors();
    }
  }, [role]);

  // Filter processors locally by search
  const filteredProcessors = processors.filter((processor) => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return (
      processor.name?.toLowerCase().includes(searchLower) ||
      processor.integration_name?.toLowerCase().includes(searchLower) ||
      processor.integration_type?.toLowerCase().includes(searchLower)
    );
  });

  // Paginate filtered results
  const paginatedProcessors = filteredProcessors.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // If role is not loaded yet, show loading
  if (!role) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      {/* Page Header */}
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        Payment Processors
      </Typography>

      {/* Summary Cards - Moved to Top */}
      {!loading && processors.length > 0 && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom variant="body2">
                  Total Processors
                </Typography>
                <Typography variant="h4" fontWeight={600}>
                  {processors.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom variant="body2">
                  Active Processors
                </Typography>
                <Typography variant="h4" fontWeight={600} color="success.main">
                  {processors.filter(p => p.is_active === 1).length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom variant="body2">
                  Total Balance
                </Typography>
                <Typography variant="h5" fontWeight={600} color="primary.main">
                  {formatCurrency(processors.reduce((sum, p) => sum + (p.balance || 0), 0))}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom variant="body2">
                  Integration Types
                </Typography>
                <Typography variant="h4" fontWeight={600}>
                  {new Set(processors.map(p => p.integration_type)).size}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Filters Row */}
      <Box sx={{ mb: 3 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <TextField
            size="small"
            label="Search"
            placeholder="Search by name, integration, or type"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ minWidth: 300 }}
          />
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
                    <TableCell sx={{ fontWeight: 600 }}>NAME</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>INTEGRATION</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>TYPE</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>API ENDPOINT</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>CLIENT ID</TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="right">BALANCE</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>PRODUCTS</TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="center">STATUS</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {paginatedProcessors.length > 0 ? (
                    paginatedProcessors.map((processor, index) => (
                      <TableRow hover key={index}>
                        <TableCell>
                          <Typography variant="body2" fontWeight={500}>
                            {processor.name}
                          </Typography>
                        </TableCell>
                        <TableCell>{processor.integration_name}</TableCell>
                        <TableCell>
                          <Chip
                            label={processor.integration_type}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ 
                            maxWidth: 200, 
                            overflow: 'hidden', 
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            {processor.api_endpoint}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            ********
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" fontWeight={500} color="success.main">
                            {formatCurrency(processor.balance)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                            {processor.products?.map((product, idx) => (
                              <Chip
                                key={idx}
                                label={product}
                                size="small"
                                sx={{ fontSize: '0.7rem' }}
                              />
                            ))}
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={processor.is_active === 1 ? 'Active' : 'Inactive'}
                            color={processor.is_active === 1 ? 'success' : 'error'}
                            size="small"
                            sx={{ minWidth: 70 }}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        <Typography variant="body2" color="textSecondary" py={3}>
                          No processors found
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
                count={filteredProcessors.length}
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