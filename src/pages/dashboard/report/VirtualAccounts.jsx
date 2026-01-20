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
  CircularProgress,
  Alert,
  Paper,
  Stack,
  Card,
  CardContent,
  Grid
} from '@mui/material';

import { apiGet } from '../../../api/http';
import { useMerchant } from '../../../context/MerchantContext';
import { API_URLS } from '../../../api/apiUrl';

const statusColor = {
  Active: 'success',
  Inactive: 'error',
  Suspended: 'warning',
  Pending: 'info'
};

export default function VirtualAccounts() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { role} = useMerchant();
    
      let url =''
      if(role=='user'){
        url=API_URLS.merchant.virtualAccount.virtualAccount
      }
    
      if(role=='admin'){
        url=API_URLS.admin.virtualAccount.virtualAccount
      }
  // Fetch virtual accounts from API
  const fetchAccounts = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiGet(
        url,
        {}
      );

      if (response.success && response.data?.message?.success) {
        setAccounts(response.data.message.accounts || []);
      } else {
        setError('Failed to fetch virtual accounts');
      }
    } catch (err) {
      setError(err.message || 'Error fetching virtual accounts');
      setAccounts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  // Filter accounts locally
  const filteredAccounts = accounts.filter((account) => {
    const matchesSearch = !search || 
      account.name?.toLowerCase().includes(search.toLowerCase()) ||
      account.account_number?.toLowerCase().includes(search.toLowerCase()) ||
      account.merchant_name?.toLowerCase().includes(search.toLowerCase()) ||
      account.prefix?.toLowerCase().includes(search.toLowerCase()) ||
      account.ifsc?.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || account.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Calculate statistics
  const stats = {
    total: accounts.length,
    active: accounts.filter(a => a.status === 'Active').length,
    inactive: accounts.filter(a => a.status === 'Inactive').length,
    suspended: accounts.filter(a => a.status === 'Suspended').length
  };

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      {/* Page Header */}
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        Virtual Accounts
      </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            elevation={0} 
            sx={{ 
              border: '1px solid #e0e0e0',
              borderRadius: 2,
              transition: 'all 0.3s',
              '&:hover': {
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                transform: 'translateY(-2px)'
              }
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography 
                color="textSecondary" 
                variant="body2" 
                sx={{ mb: 1.5, fontSize: '0.875rem', fontWeight: 500 }}
              >
                Total Accounts
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 700, color: '#1a1a1a' }}>
                {stats.total}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            elevation={0} 
            sx={{ 
              border: '1px solid #e8f5e9',
              borderLeft: '5px solid #4caf50',
              borderRadius: 2,
              bgcolor: '#f1f8f4',
              transition: 'all 0.3s',
              '&:hover': {
                boxShadow: '0 4px 12px rgba(76,175,80,0.15)',
                transform: 'translateY(-2px)'
              }
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography 
                sx={{ mb: 1.5, fontSize: '0.875rem', fontWeight: 500, color: '#2e7d32' }}
              >
                Active
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 700, color: '#2e7d32' }}>
                {stats.active}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            elevation={0} 
            sx={{ 
              border: '1px solid #ffebee',
              borderLeft: '5px solid #f44336',
              borderRadius: 2,
              bgcolor: '#fef5f5',
              transition: 'all 0.3s',
              '&:hover': {
                boxShadow: '0 4px 12px rgba(244,67,54,0.15)',
                transform: 'translateY(-2px)'
              }
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography 
                sx={{ mb: 1.5, fontSize: '0.875rem', fontWeight: 500, color: '#c62828' }}
              >
                Inactive
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 700, color: '#c62828' }}>
                {stats.inactive}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            elevation={0} 
            sx={{ 
              border: '1px solid #fff3e0',
              borderLeft: '5px solid #ff9800',
              borderRadius: 2,
              bgcolor: '#fffaf0',
              transition: 'all 0.3s',
              '&:hover': {
                boxShadow: '0 4px 12px rgba(255,152,0,0.15)',
                transform: 'translateY(-2px)'
              }
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography 
                sx={{ mb: 1.5, fontSize: '0.875rem', fontWeight: 500, color: '#e65100' }}
              >
                Suspended
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 700, color: '#e65100' }}>
                {stats.suspended}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters Row */}
      <Box sx={{ mb: 3 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <TextField
            size="small"
            label="Search"
            placeholder="Search by account, merchant, prefix..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ minWidth: 300 }}
          />

          <TextField
            select
            size="small"
            label="Status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="all">All Status</MenuItem>
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Inactive">Inactive</MenuItem>
            <MenuItem value="Suspended">Suspended</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
          </TextField>
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
          <TableContainer>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                  <TableCell sx={{ fontWeight: 600 }}>ACCOUNT NAME</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>ACCOUNT NUMBER</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>IFSC CODE</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>PREFIX</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>MERCHANT NAME</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>STATUS</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredAccounts.length > 0 ? (
                  filteredAccounts.map((account, index) => (
                    <TableRow hover key={index}>
                      <TableCell>{account.name || '-'}</TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 500 }}>
                          {account.account_number}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                          {account.ifsc}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={account.prefix} 
                          size="small" 
                          variant="outlined"
                          sx={{ fontFamily: 'monospace' }}
                        />
                      </TableCell>
                      <TableCell>{account.merchant_name || '-'}</TableCell>
                      <TableCell>
                        <Chip
                          label={account.status}
                          color={statusColor[account.status] || 'default'}
                          size="small"
                          sx={{ minWidth: 80 }}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Typography variant="body2" color="textSecondary" py={3}>
                        No virtual accounts found
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Results Count */}
      {!loading && filteredAccounts.length > 0 && (
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="textSecondary">
            Showing {filteredAccounts.length} of {accounts.length} accounts
          </Typography>
        </Box>
      )}
    </Box>
  );
}