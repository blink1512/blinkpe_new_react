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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Collapse,
  IconButton,
  InputAdornment,
  Select,
  FormControl,
  InputLabel,
  Checkbox,
  Menu
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import toast from 'react-hot-toast';
import { useMerchant } from '../../context/MerchantContext';
import { apiPost } from '../../api/http';
import { API_URLS } from '../../api/apiUrl';

const statusColor = {
  Approved: 'success',
  Pending: 'warning',
  Rejected: 'error',
  Suspended: 'error'
};

export default function Merchants() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [merchants, setMerchants] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openOnboardDialog, setOpenOnboardDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [onboardLoading, setOnboardLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [expandedRows, setExpandedRows] = useState({});
  const [selectedMerchants, setSelectedMerchants] = useState([]);
  const [bulkActionAnchor, setBulkActionAnchor] = useState(null);

  const { role } = useMerchant();

  // Onboarding form state
  const [onboardForm, setOnboardForm] = useState({
    company_name: '',
    email: '',
    password: '',
    pancard: ''
  });

  // Edit form state
  const [editForm, setEditForm] = useState({
    merchant: '',
    status: '',
    integration: '',
    webhook: '',
    pricing: []
  });

  const [currentPricing, setCurrentPricing] = useState({
    product: 'UPI',
    fee_type: 'Percentage',
    fee: 0,
    tax_fee_type: 'Percentage',
    tax_fee: 18,
    start_value: 0,
    end_value: 100000
  });

  // Fetch merchants from API
  const fetchMerchants = async () => {
    try {
      setLoading(true);
      setError(null);

      const requestData = {
        page: page + 1,
        page_size: rowsPerPage
      };

      const response = await apiPost(
        API_URLS.admin.merchant.merchant,
        requestData
      );

      if (response.success && response.data?.message) {
        setMerchants(response.data.message.merchants || []);
        setTotal(response.data.message.total || 0);
      } else {
        setError('Failed to fetch merchants');
        toast.error('Failed to fetch merchants');
      }
    } catch (err) {
      const errorMsg = err.message || 'Error fetching merchants';
      setError(errorMsg);
      toast.error(errorMsg);
      setMerchants([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (role === 'admin') {
      fetchMerchants();
    }
  }, [page, rowsPerPage, role]);

  // Filter merchants locally by search and status
  const filteredMerchants = merchants.filter((merchant) => {
    const matchesSearch = !search || 
      merchant.name?.toLowerCase().includes(search.toLowerCase()) ||
      merchant.company_name?.toLowerCase().includes(search.toLowerCase()) ||
      merchant.company_email?.toLowerCase().includes(search.toLowerCase()) ||
      merchant.contact_detail?.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = status === 'all' || merchant.status === status;
    
    return matchesSearch && matchesStatus;
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
  };

  const handleOpenOnboardDialog = () => {
    setOnboardForm({
      company_name: '',
      email: '',
      password: '',
      pancard: ''
    });
    setOpenOnboardDialog(true);
  };

  const handleCloseOnboardDialog = () => {
    setOpenOnboardDialog(false);
    setOnboardForm({
      company_name: '',
      email: '',
      password: '',
      pancard: ''
    });
  };

  const handleOnboardFormChange = (field, value) => {
    setOnboardForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleOnboardMerchant = async () => {
    try {
      setOnboardLoading(true);

      const response = await apiPost(
        API_URLS.admin.merchant.onboard,
        onboardForm
      );

      if (response.success && response.data?.message?.success) {
        toast.success(
          `Merchant onboarded successfully! Merchant ID: ${response.data.message.merchant_id}`,
          { duration: 4000 }
        );
        handleCloseOnboardDialog();
        fetchMerchants();
      } else {
        toast.error('Failed to onboard merchant');
      }
    } catch (err) {
      toast.error(err.message || 'Error onboarding merchant');
    } finally {
      setOnboardLoading(false);
    }
  };

  const handleOpenEditDialog = (merchant) => {
    setEditForm({
      merchant: merchant.name,
      status: merchant.status || '',
      integration: merchant.integration || '',
      webhook: merchant.webhook || '',
      pricing: merchant.product_pricing || []
    });
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setEditForm({
      merchant: '',
      status: '',
      integration: '',
      webhook: '',
      pricing: []
    });
    setCurrentPricing({
      product: 'UPI',
      fee_type: 'Percentage',
      fee: 0,
      tax_fee_type: 'Percentage',
      tax_fee: 18,
      start_value: 0,
      end_value: 100000
    });
  };

  const handleEditFormChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePricingChange = (field, value) => {
    setCurrentPricing(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddPricing = () => {
    setEditForm(prev => ({
      ...prev,
      pricing: [...prev.pricing, { ...currentPricing }]
    }));
    setCurrentPricing({
      product: 'UPI',
      fee_type: 'Percentage',
      fee: 0,
      tax_fee_type: 'Percentage',
      tax_fee: 18,
      start_value: 0,
      end_value: 100000
    });
  };

  const handleRemovePricing = (index) => {
    setEditForm(prev => ({
      ...prev,
      pricing: prev.pricing.filter((_, i) => i !== index)
    }));
  };

  const handleUpdateMerchant = async () => {
    try {
      setEditLoading(true);

      const requestData = {
        merchant: editForm.merchant,
        status: editForm.status,
        integration: editForm.integration,
        webhook: editForm.webhook,
        pricing: editForm.pricing
      };

      const response = await apiPost(
        API_URLS.admin.merchant.update,
        requestData
      );

      if (response.success && response.data?.message?.success) {
        toast.success('Merchant updated successfully!');
        handleCloseEditDialog();
        fetchMerchants();
      } else {
        toast.error('Failed to update merchant');
      }
    } catch (err) {
      toast.error(err.message || 'Error updating merchant');
    } finally {
      setEditLoading(false);
    }
  };

  const handleSelectMerchant = (merchantName) => {
    setSelectedMerchants(prev => {
      if (prev.includes(merchantName)) {
        return prev.filter(name => name !== merchantName);
      } else {
        return [...prev, merchantName];
      }
    });
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedMerchants(filteredMerchants.map(m => m.name));
    } else {
      setSelectedMerchants([]);
    }
  };

  const handleBulkAction = async (action, value) => {
    try {
      const requestData = {
        merchants: selectedMerchants,
        action: action,
        value: value
      };

      const response = await apiPost(
        API_URLS.admin.merchant.bulkUpdate,
        requestData
      );

      if (response.success && response.data?.message?.success) {
        toast.success(`Bulk ${action} completed successfully!`);
        setSelectedMerchants([]);
        fetchMerchants();
      } else {
        toast.error('Failed to perform bulk action');
      }
    } catch (err) {
      toast.error(err.message || 'Error performing bulk action');
    }
    setBulkActionAnchor(null);
  };

  const toggleRowExpansion = (merchantName) => {
    setExpandedRows(prev => ({
      ...prev,
      [merchantName]: !prev[merchantName]
    }));
  };

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

  if (role !== 'admin') {
    return (
      <Box sx={{ width: '100%', p: 3 }}>
        <Alert severity="warning">
          You do not have permission to view this page.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      {/* Page Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" fontWeight={600}>
          Merchants
        </Typography>
        <Stack direction="row" spacing={2}>
          {selectedMerchants.length > 0 && (
            <>
              <Button
                variant="outlined"
                onClick={(e) => setBulkActionAnchor(e.currentTarget)}
                sx={{ textTransform: 'none' }}
              >
                Bulk Actions ({selectedMerchants.length})
              </Button>
              <Menu
                anchorEl={bulkActionAnchor}
                open={Boolean(bulkActionAnchor)}
                onClose={() => setBulkActionAnchor(null)}
              >
                <MenuItem onClick={() => handleBulkAction('update_status', 'Approved')}>
                  Approve Selected
                </MenuItem>
                <MenuItem onClick={() => handleBulkAction('update_status', 'Rejected')}>
                  Reject Selected
                </MenuItem>
                <MenuItem onClick={() => handleBulkAction('update_status', 'Suspended')}>
                  Suspend Selected
                </MenuItem>
              </Menu>
            </>
          )}
          <Button
            variant="contained"
         
             style={{backgroundColor:"#d95053"}}
            onClick={handleOpenOnboardDialog}
            sx={{ textTransform: 'none', px: 3 }}
          >
            + Onboard Merchant
          </Button>
        </Stack>
      </Box>

      {/* Filters Row */}
      <Box sx={{ mb: 3 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <TextField
            size="small"
            label="Search"
            placeholder="Search by name, email, or contact"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ minWidth: 300 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
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
            <MenuItem value="Approved">Approved</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Rejected">Rejected</MenuItem>
            <MenuItem value="Suspended">Suspended</MenuItem>
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
          <>
            <TableContainer>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedMerchants.length === filteredMerchants.length && filteredMerchants.length > 0}
                        indeterminate={selectedMerchants.length > 0 && selectedMerchants.length < filteredMerchants.length}
                        onChange={handleSelectAll}
                      />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, width: 50 }}></TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>MERCHANT ID</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>COMPANY NAME</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>EMAIL</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>CONTACT</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>STATUS</TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="right">WALLET BALANCE</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>INTEGRATION</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>CREATED</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>ACTIONS</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {filteredMerchants.length > 0 ? (
                    filteredMerchants.map((merchant) => (
                      <>
                        <TableRow hover key={merchant.name}>
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={selectedMerchants.includes(merchant.name)}
                              onChange={() => handleSelectMerchant(merchant.name)}
                            />
                          </TableCell>
                          <TableCell>
                            <IconButton
                              size="small"
                              onClick={() => toggleRowExpansion(merchant.name)}
                              sx={{ 
                                bgcolor: expandedRows[merchant.name] ? '#e3f2fd' : 'transparent',
                                '&:hover': { bgcolor: expandedRows[merchant.name] ? '#bbdefb' : '#f5f5f5' }
                              }}
                            >
                              {expandedRows[merchant.name] ? (
                                <RemoveIcon fontSize="small" />
                              ) : (
                                <AddIcon fontSize="small" />
                              )}
                            </IconButton>
                          </TableCell>
                          <TableCell sx={{ fontWeight: 500 }}>{merchant.name}</TableCell>
                          <TableCell>{merchant.company_name}</TableCell>
                          <TableCell>{merchant.company_email}</TableCell>
                          <TableCell>{merchant.contact_detail || '-'}</TableCell>
                          <TableCell>
                            <Chip
                              label={merchant.status}
                              color={statusColor[merchant.status] || 'default'}
                              size="small"
                              sx={{ minWidth: 80 }}
                            />
                          </TableCell>
                          <TableCell align="right" sx={{ fontWeight: 500 }}>
                            ₹{merchant.wallet_balance?.toFixed(2) || '0.00'}
                          </TableCell>
                          <TableCell>{merchant.integration || '-'}</TableCell>
                          <TableCell>{formatDate(merchant.creation)}</TableCell>
                          <TableCell>
                            <IconButton
                              size="small"
                              onClick={() => handleOpenEditDialog(merchant)}
                              color="primary"
                            >
                              <EditIcon fontSize="small"  style={{color:"#d95053"}}/>
                            </IconButton>
                          </TableCell>
                        </TableRow>
                        
                        {/* Expandable Details Row */}
                        <TableRow>
                          <TableCell colSpan={11} sx={{ p: 0, border: 0 }}>
                            <Collapse in={expandedRows[merchant.name]} timeout="auto" unmountOnExit>
                              <Box sx={{ p: 3, bgcolor: '#fafafa', borderTop: '1px solid #e0e0e0', borderBottom: '1px solid #e0e0e0' }}>
                                {/* Webhook URL Section */}
                                <Box sx={{ mb: 3 }}>
                                  <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                                    Webhook URL
                                  </Typography>
                                  <Paper sx={{ p: 2, bgcolor: '#fff' }}>
                                    <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                                      {merchant.webhook || 'No webhook configured'}
                                    </Typography>
                                  </Paper>
                                </Box>

                                {/* Product Pricing Section */}
                                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                                  Product Pricing Configuration
                                </Typography>
                                {merchant.product_pricing && merchant.product_pricing.length > 0 ? (
                                  <Table size="small">
                                    <TableHead>
                                      <TableRow sx={{ bgcolor: '#fff' }}>
                                        <TableCell sx={{ fontWeight: 600 }}>Product</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>Fee Type</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>Fee</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>Tax Fee Type</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>Tax Fee</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>Range</TableCell>
                                      </TableRow>
                                    </TableHead>
                                    <TableBody>
                                      {merchant.product_pricing.map((pricing, idx) => (
                                        <TableRow key={idx} sx={{ bgcolor: '#fff' }}>
                                          <TableCell sx={{ fontWeight: 500 }}>{pricing.product}</TableCell>
                                          <TableCell>{pricing.fee_type}</TableCell>
                                          <TableCell>
                                            {pricing.fee_type === 'Percentage' 
                                              ? `${pricing.fee}%` 
                                              : `₹${pricing.fee}`}
                                          </TableCell>
                                          <TableCell>{pricing.tax_fee_type}</TableCell>
                                          <TableCell>
                                            {pricing.tax_fee_type === 'Percentage' 
                                              ? `${pricing.tax_fee}%` 
                                              : `₹${pricing.tax_fee}`}
                                          </TableCell>
                                          <TableCell>
                                            ₹{pricing.start_value?.toLocaleString('en-IN')} - ₹{pricing.end_value?.toLocaleString('en-IN')}
                                          </TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                ) : (
                                  <Box 
                                    sx={{ 
                                      p: 3, 
                                      bgcolor: '#fff', 
                                      border: '1px dashed #ccc', 
                                      borderRadius: 1,
                                      textAlign: 'center' 
                                    }}
                                  >
                                    <Typography variant="body2" color="text.secondary">
                                      No price set for this merchant
                                    </Typography>
                                  </Box>
                                )}
                              </Box>
                            </Collapse>
                          </TableCell>
                        </TableRow>
                      </>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={11} align="center">
                        <Typography variant="body2" color="textSecondary" py={3}>
                          No merchants found
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

      {/* Onboard Merchant Dialog */}
      <Dialog 
        open={openOnboardDialog} 
        onClose={handleCloseOnboardDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle sx={{ fontWeight: 600, fontSize: '1.25rem' }}>
          Onboard New Merchant
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Grid container spacing={2.5} sx={{ mt: 0.5 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Company Name *"
                placeholder="Enter company name"
                value={onboardForm.company_name}
                onChange={(e) => handleOnboardFormChange('company_name', e.target.value)}
                required
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email *"
                placeholder="Enter email address"
                type="email"
                value={onboardForm.email}
                onChange={(e) => handleOnboardFormChange('email', e.target.value)}
                required
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Password *"
                placeholder="Enter password"
                type="password"
                value={onboardForm.password}
                onChange={(e) => handleOnboardFormChange('password', e.target.value)}
                required
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="PAN Card *"
                placeholder="Enter PAN card number"
                value={onboardForm.pancard}
                onChange={(e) => handleOnboardFormChange('pancard', e.target.value.toUpperCase())}
                required
                variant="outlined"
                inputProps={{ maxLength: 10, style: { textTransform: 'uppercase' } }}
                helperText="Format: ABCDE1234F"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, pt: 1.5 }}>
          <Button 
            onClick={handleCloseOnboardDialog} 
            disabled={onboardLoading}
            sx={{ textTransform: 'none' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleOnboardMerchant}
            variant="contained"
            disabled={onboardLoading || !onboardForm.company_name || !onboardForm.email || !onboardForm.password || !onboardForm.pancard}
            sx={{ textTransform: 'none', px: 3 }}
          >
            {onboardLoading ? <CircularProgress size={24} /> : 'Onboard Merchant'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Merchant Dialog */}
      <Dialog 
        open={openEditDialog} 
        onClose={handleCloseEditDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle sx={{ fontWeight: 600, fontSize: '1.25rem' }}>
          Edit Merchant - {editForm.merchant}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Grid container spacing={2.5} sx={{ mt: 0.5 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={editForm.status}
                  label="Status"
                  onChange={(e) => handleEditFormChange('status', e.target.value)}
                >
                  <MenuItem value="Approved">Approved</MenuItem>
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Rejected">Rejected</MenuItem>
                  <MenuItem value="Suspended">Suspended</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Integration"
                placeholder="Enter integration name"
                value={editForm.integration}
                onChange={(e) => handleEditFormChange('integration', e.target.value)}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Webhook URL"
                placeholder="https://api.example.com/webhook"
                value={editForm.webhook}
                onChange={(e) => handleEditFormChange('webhook', e.target.value)}
                variant="outlined"
              />
            </Grid>

            {/* Pricing Configuration */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ mt: 2 }}>
                Product Pricing
              </Typography>
            </Grid>

            {/* Current Pricing List */}
            {editForm.pricing.length > 0 && (
              <Grid item xs={12}>
                <Paper sx={{ p: 2, bgcolor: '#fafafa' }}>
                  {editForm.pricing.map((pricing, idx) => (
                    <Box key={idx} sx={{ mb: 2, p: 2, bgcolor: '#fff', borderRadius: 1, border: '1px solid #e0e0e0' }}>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={2}>
                          <Typography variant="body2"><strong>{pricing.product}</strong></Typography>
                        </Grid>
                        <Grid item xs={2}>
                          <Typography variant="body2">{pricing.fee_type}: {pricing.fee_type === 'Percentage' ? `${pricing.fee}%` : `₹${pricing.fee}`}</Typography>
                        </Grid>
                        <Grid item xs={2}>
                          <Typography variant="body2">Tax: {pricing.tax_fee_type === 'Percentage' ? `${pricing.tax_fee}%` : `₹${pricing.tax_fee}`}</Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography variant="body2">Range: ₹{pricing.start_value?.toLocaleString('en-IN')} - ₹{pricing.end_value?.toLocaleString('en-IN')}</Typography>
                        </Grid>
                        <Grid item xs={2} sx={{ textAlign: 'right' }}>
                          <IconButton size="small" color="error" onClick={() => handleRemovePricing(idx)}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </Box>
                  ))}
                </Paper>
              </Grid>
            )}

            {/* Add New Pricing */}
            <Grid item xs={12}>
              <Paper sx={{ p: 2, bgcolor: '#f5f5f5' }}>
                <Typography variant="body2" fontWeight={600} gutterBottom>
                  Add New Pricing Rule
                </Typography>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Product</InputLabel>
                      <Select
                        value={currentPricing.product}
                        label="Product"
                        onChange={(e) => handlePricingChange('product', e.target.value)}
                      >
                        <MenuItem value="UPI">UPI</MenuItem>
                        <MenuItem value="IMPS">IMPS</MenuItem>
                        <MenuItem value="RTGS">RTGS</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Fee Type</InputLabel>
                      <Select
                        value={currentPricing.fee_type}
                        label="Fee Type"
                        onChange={(e) => handlePricingChange('fee_type', e.target.value)}
                      >
                        <MenuItem value="Percentage">Percentage</MenuItem>
                        <MenuItem value="Fixed">Fixed</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Fee"
                      type="number"
                      value={currentPricing.fee}
                      onChange={(e) => handlePricingChange('fee', parseFloat(e.target.value))}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Tax Fee Type</InputLabel>
                      <Select
                        value={currentPricing.tax_fee_type}
                        label="Tax Fee Type"
                        onChange={(e) => handlePricingChange('tax_fee_type', e.target.value)}
                      >
                        <MenuItem value="Percentage">Percentage</MenuItem>
                        <MenuItem value="Fixed">Fixed</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Tax Fee"
                      type="number"
                      value={currentPricing.tax_fee}
                      onChange={(e) => handlePricingChange('tax_fee', parseFloat(e.target.value))}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Start Value"
                      type="number"
                      value={currentPricing.start_value}
                      onChange={(e) => handlePricingChange('start_value', parseFloat(e.target.value))}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="End Value"
                      type="number"
                      value={currentPricing.end_value}
                      onChange={(e) => handlePricingChange('end_value', parseFloat(e.target.value))}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant="outlined"
                      
                      onClick={handleAddPricing}
                      sx={{ textTransform: 'none' }}
                    >
                      + Add Pricing Rule
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, pt: 1.5 }}>
          <Button 
            onClick={handleCloseEditDialog} 
            disabled={editLoading}
            sx={{ textTransform: 'none' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdateMerchant}
            variant="contained"
             style={{backgroundColor:"#d95053"}}
            disabled={editLoading}
            sx={{ textTransform: 'none', px: 3 }}
          >
            {editLoading ? <CircularProgress size={24} /> : 'Update Merchant'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}