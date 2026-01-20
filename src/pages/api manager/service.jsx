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
  Switch,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Snackbar
} from '@mui/material';
import { apiPost } from '../../api/http';


export default function Service() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [toggleLoading, setToggleLoading] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ open: false, service: null, newStatus: false });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Fetch Services from API
  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiPost('/method/iswitch.admin_portal_api.get_services', {});

      if (response.success && response.message?.services) {
        setServices(response.message.services || []);
      } else {
        setError('Failed to fetch services');
      }
    } catch (err) {
      setError(err.message || 'Error fetching services');
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  // Toggle Service Status
  const toggleServiceStatus = async (serviceName, newStatus) => {
    try {
      setToggleLoading(serviceName);

      const response = await apiPost('/method/iswitch.admin_portal_api.toggle_service_status', {
        service_name: serviceName,
        is_active: newStatus
      });

      if (response.success || response.message?.success) {
        // Update local state
        setServices(prevServices => 
          prevServices.map(service => 
            service.name === serviceName 
              ? { ...service, is_active: newStatus ? 1 : 0 }
              : service
          )
        );

        setSnackbar({
          open: true,
          message: `Service ${newStatus ? 'activated' : 'deactivated'} successfully`,
          severity: 'success'
        });
      } else {
        throw new Error('Failed to update service status');
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message || 'Error updating service status',
        severity: 'error'
      });
      
      // Revert the change by refetching
      fetchServices();
    } finally {
      setToggleLoading(null);
      setConfirmDialog({ open: false, service: null, newStatus: false });
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // Filter services locally by search
  const filteredServices = services.filter((service) => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return (
      service.name?.toLowerCase().includes(searchLower) ||
      service.product_name?.toLowerCase().includes(searchLower)
    );
  });

  // Pagination logic
  const paginatedServices = filteredServices.slice(
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

  const handleToggleClick = (service) => {
    const newStatus = service.is_active === 0;
    setConfirmDialog({
      open: true,
      service: service,
      newStatus: newStatus
    });
  };

  const handleConfirmToggle = () => {
    if (confirmDialog.service) {
      toggleServiceStatus(confirmDialog.service.name, confirmDialog.newStatus);
    }
  };

  const handleCloseDialog = () => {
    setConfirmDialog({ open: false, service: null, newStatus: false });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      {/* Page Header */}
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        Services Management
      </Typography>

      {/* Filters Row */}
      <Box sx={{ mb: 3 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <TextField
            size="small"
            label="Search"
            placeholder="Search by service name or product name..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
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
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                    <TableCell sx={{ fontWeight: 600 }}>SERVICE NAME</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>PRODUCT NAME</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>STATUS</TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="center">ACTION</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {paginatedServices.length > 0 ? (
                    paginatedServices.map((service, index) => (
                      <TableRow hover key={`${service.name}-${index}`}>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {service.name}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {service.product_name}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={service.is_active === 1 ? 'Active' : 'Inactive'}
                            color={service.is_active === 1 ? 'success' : 'default'}
                            size="small"
                            sx={{ minWidth: 70 }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Stack direction="row" alignItems="center" justifyContent="center" spacing={1}>
                            <Switch
                              checked={service.is_active === 1}
                              onChange={() => handleToggleClick(service)}
                              disabled={toggleLoading === service.name}
                              color="primary"
                            />
                            {toggleLoading === service.name && (
                              <CircularProgress size={20} />
                            )}
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        <Typography variant="body2" color="textSecondary" py={3}>
                          No services found
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
                count={filteredServices.length}
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

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={handleCloseDialog}
        aria-labelledby="confirm-dialog-title"
      >
        <DialogTitle id="confirm-dialog-title">
          Confirm Service Status Change
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to {confirmDialog.newStatus ? 'activate' : 'deactivate'} the service{' '}
            <strong>{confirmDialog.service?.product_name}</strong>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="inherit">
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmToggle} 
            color="primary" 
            variant="contained"
            autoFocus
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success/Error Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}