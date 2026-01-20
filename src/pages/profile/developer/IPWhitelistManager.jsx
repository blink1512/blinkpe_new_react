import { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  IconButton,
  Chip,
  Stack,
  Tooltip,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';

import {
  SafetyOutlined,
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { apiGet, apiPost } from '../../../api/http';
import { API_URLS } from '../../../api/apiUrl';
import { useMerchant } from '../../../context/MerchantContext';

export default function IPWhitelistManager() {
  const [ipAddresses, setIpAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [newIP, setNewIP] = useState('');
  const [adding, setAdding] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const { role } = useMerchant();
  // Fetch IP addresses on component mount
  useEffect(() => {
    fetchIPAddresses();
  }, []);

  let geturl = ''
  let generateurl = ''

  if (role == 'user') {
    geturl = API_URLS.merchant.ip.getIP
    generateurl = API_URLS.merchant.ip.addIP
  }

  const fetchIPAddresses = async () => {
    setLoading(true);
    try {
      const response = await apiGet(geturl);

      if (response.success && response.data?.message) {
        setIpAddresses(response.data.message);
      }
    } catch (error) {
      showNotification(error.message || 'Failed to fetch IP addresses', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, severity = 'success') => {
    setNotification({ open: true, message, severity });
  };

  const handleOpenDialog = () => {
    setNewIP('');
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewIP('');
  };

  const validateIP = (ip) => {
    const ipRegex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return ipRegex.test(ip);
  };

  const handleAdd = async () => {
    if (!newIP.trim()) {
      showNotification('Please enter an IP address', 'error');
      return;
    }

    if (!validateIP(newIP.trim())) {
      showNotification('Please enter a valid IP address', 'error');
      return;
    }

    // Check if IP already exists
    if (ipAddresses.some(item => item.ip === newIP.trim())) {
      showNotification('This IP address is already whitelisted', 'error');
      return;
    }

    setAdding(true);
    try {
      const response = await apiPost(generateurl, {
        ip_address: newIP.trim()
      });

      if (response.success) {
        showNotification(
          response.data?.message?.message || 'IP address whitelisted successfully!',
          'success'
        );
        handleCloseDialog();
        await fetchIPAddresses();
      }
    } catch (error) {
      showNotification(error.message || 'Failed to add IP address', 'error');
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (ipAddress) => {
    // Show confirmation dialog first
    if (!window.confirm(`Are you sure you want to remove IP address ${ipAddress} from the whitelist?`)) {
      return;
    }

    try {
      const deleteurl = API_URLS.merchant.ip.deleteIP; 

      const response = await apiPost(deleteurl, {
        ip_name: ipAddress
      });

      if (response.success) {
        showNotification(
          response.data?.message?.message || 'IP address removed successfully!',
          'success'
        );
        await fetchIPAddresses();
      }
    } catch (error) {
      showNotification(error.message || 'Failed to delete IP address', 'error');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <Card elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2.5, p: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <CircularProgress size={20} />
          <Typography>Loading IP addresses...</Typography>
        </Stack>
      </Card>
    );
  }

  return (
    <>
      <Card
        elevation={0}
        sx={{
          border: '1px solid #e0e0e0',
          borderRadius: 2.5,
          overflow: 'hidden'
        }}
      >
        <CardContent sx={{ p: 0 }}>
          {/* Header */}
          <Box sx={{ p: 3, borderBottom: '1px solid #f0f0f0' }}>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              justifyContent="space-between"
              alignItems={{ xs: 'flex-start', sm: 'center' }}
              spacing={2}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <SafetyOutlined style={{ fontSize: 20, color: '#1976D2' }} />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem', color: '#212121' }}>
                    IP Whitelist
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#757575', fontSize: '0.875rem' }}>
                    Manage allowed IP addresses ({ipAddresses.length} whitelisted)
                  </Typography>
                </Box>
              </Stack>
              <Button
                variant="contained"
                startIcon={<PlusOutlined />}
                onClick={handleOpenDialog}
                sx={{
                  bgcolor: '#2196F3',
                  color: '#fff',
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 3,
                  py: 1,
                  borderRadius: 2,
                  boxShadow: '0 2px 8px rgba(33, 150, 243, 0.2)',
                  '&:hover': {
                    bgcolor: '#1976D2',
                    boxShadow: '0 4px 12px rgba(33, 150, 243, 0.3)'
                  }
                }}
              >
                Add IP
              </Button>
            </Stack>
          </Box>

          {/* Table */}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#fafafa' }}>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', color: '#757575', textTransform: 'uppercase' }}>
                    IP Address
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', color: '#757575', textTransform: 'uppercase' }}>
                    Added Date
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', color: '#757575', textTransform: 'uppercase' }}>
                    Status
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ fontWeight: 700, fontSize: '0.75rem', color: '#757575', textTransform: 'uppercase' }}
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ipAddresses.length > 0 ? (
                  ipAddresses.map((item) => (
                    <TableRow
                      key={item.id}
                      sx={{
                        '&:hover': { bgcolor: '#fafafa' },
                        transition: 'background-color 0.2s'
                      }}
                    >
                      <TableCell>
                        <Typography
                          component="code"
                          sx={{
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            color: '#212121',
                            bgcolor: '#f5f5f5',
                            px: 1.5,
                            py: 0.75,
                            borderRadius: 1.5,
                            fontFamily: 'monospace',
                            display: 'inline-block'
                          }}
                        >
                          {item.ip}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ fontSize: '0.875rem', color: '#616161' }}>
                        {formatDate(item.date)}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label="Active"
                          size="small"
                          icon={
                            <Box
                              sx={{
                                width: 6,
                                height: 6,
                                borderRadius: '50%',
                                bgcolor: '#4caf50',
                                ml: 1
                              }}
                            />
                          }
                          sx={{
                            bgcolor: '#E8F5E9',
                            color: '#2e7d32',
                            fontWeight: 600,
                            fontSize: '0.75rem',
                            height: 28
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={0.5} justifyContent="center">
                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              onClick={() => handleDelete(item.id)}
                              sx={{
                                color: '#757575',
                                '&:hover': {
                                  bgcolor: '#FFEBEE',
                                  color: '#d32f2f'
                                }
                              }}
                            >
                              <DeleteOutlined style={{ fontSize: 16 }} />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                      <Typography variant="body2" sx={{ color: '#757575' }}>
                        No IP addresses whitelisted yet
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Add IP Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Add IP Address
          </Typography>
          <Typography variant="body2" sx={{ color: '#757575', mt: 0.5 }}>
            Add a new IP to the whitelist
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            fullWidth
            label="IP Address"
            placeholder="192.168.1.1"
            value={newIP}
            onChange={(e) => setNewIP(e.target.value)}
            disabled={adding}
            helperText="Enter a valid IPv4 address (e.g., 192.168.1.1)"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2
              }
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={handleCloseDialog}
            disabled={adding}
            sx={{
              color: '#616161',
              textTransform: 'none',
              fontWeight: 500
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAdd}
            variant="contained"
            disabled={adding}
            sx={{
              bgcolor: '#2196F3',
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              borderRadius: 2,
              '&:hover': { bgcolor: '#1976D2' }
            }}
          >
            {adding ? <CircularProgress size={20} color="inherit" /> : 'Add IP Address'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={3000}
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          severity={notification.severity}
          variant="filled"
          icon={<CheckCircleOutlined />}
          sx={{
            borderRadius: 2,
            fontWeight: 600
          }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
}