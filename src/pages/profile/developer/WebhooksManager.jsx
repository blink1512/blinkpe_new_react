import { useState } from 'react';
import {
  Typography,
  Box,
  IconButton,
  Chip,
  Stack,
  Tooltip,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';

import {
  ApiOutlined,
  CopyOutlined,
  CheckCircleOutlined,
  EditOutlined,
  PlusOutlined
} from '@ant-design/icons';
import { useMerchant } from '../../../context/MerchantContext';
import { apiPost } from '../../../api/http';
import { API_URLS } from '../../../api/apiUrl';

export default function WebhooksManager() {
  const { merchant,role, loading, refetchMerchant } = useMerchant();
  const [copiedMessage, setCopiedMessage] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [updating, setUpdating] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

    let generateurl = ''
  
    if (role == 'user') {
     
      generateurl = API_URLS.merchant.webhook.updateWebhook
    }
  const handleCopyUrl = (url) => {
    navigator.clipboard.writeText(url);
    setCopiedMessage('URL copied!');
    setTimeout(() => setCopiedMessage(''), 2000);
  };

  const handleOpenDialog = () => {
    setWebhookUrl(merchant?.webhook || '');
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setWebhookUrl('');
  };

  const showNotification = (message, severity = 'success') => {
    setNotification({ open: true, message, severity });
  };

  const handleUpdateWebhook = async () => {
    if (!webhookUrl.trim()) {
      showNotification('Please enter a valid webhook URL', 'error');
      return;
    }

    // Basic URL validation
    try {
      new URL(webhookUrl);
    } catch (e) {
      showNotification('Please enter a valid URL', 'error');
      return;
    }

    setUpdating(true);
    try {
      const response = await apiPost(generateurl, {
        webhook_url: webhookUrl
      });

      if (response.success) {
        showNotification(response.data?.message?.message || 'Webhook updated successfully!', 'success');
        handleCloseDialog();
        
        // Refresh merchant data to get updated webhook
        if (refetchMerchant) {
          await refetchMerchant();
        }
      }
    } catch (error) {
      showNotification(error.message || 'Failed to update webhook URL', 'error');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <Card elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2.5, p: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <CircularProgress size={20} />
          <Typography>Loading...</Typography>
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
                    background: 'linear-gradient(135deg, #FCE4EC 0%, #F8BBD0 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <ApiOutlined style={{ fontSize: 20, color: '#C2185B' }} />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem', color: '#212121' }}>
                    Webhook URL
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#757575', fontSize: '0.875rem' }}>
                    Your configured webhook endpoint
                  </Typography>
                </Box>
              </Stack>
              
              {/* Conditional Button - Add or Update */}
              <Button
                variant="contained"
                startIcon={merchant?.webhook ? <EditOutlined /> : <PlusOutlined />}
                onClick={handleOpenDialog}
                sx={{
                  bgcolor: '#E91E63',
                  color: '#fff',
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 3,
                  py: 1,
                  borderRadius: 2,
                  boxShadow: '0 2px 8px rgba(233, 30, 99, 0.2)',
                  '&:hover': {
                    bgcolor: '#C2185B',
                    boxShadow: '0 4px 12px rgba(233, 30, 99, 0.3)'
                  }
                }}
              >
                {merchant?.webhook ? 'Update Webhook' : 'Add Webhook'}
              </Button>
            </Stack>
          </Box>

          {/* Table */}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#fafafa' }}>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', color: '#757575', textTransform: 'uppercase' }}>
                    Webhook URL
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
                {merchant?.webhook ? (
                  <TableRow
                    sx={{
                      '&:hover': { bgcolor: '#fafafa' },
                      transition: 'background-color 0.2s'
                    }}
                  >
                    <TableCell>
                      <Typography
                        component="code"
                        sx={{
                          fontSize: '0.75rem',
                          color: '#424242',
                          bgcolor: '#f5f5f5',
                          px: 1.5,
                          py: 0.75,
                          borderRadius: 1.5,
                          fontFamily: 'monospace',
                          display: 'block',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {merchant.webhook}
                      </Typography>
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
                        <Tooltip title={copiedMessage || "Copy URL"}>
                          <IconButton
                            size="small"
                            onClick={() => handleCopyUrl(merchant.webhook)}
                            sx={{
                              color: '#757575',
                              '&:hover': {
                                bgcolor: '#FCE4EC',
                                color: '#E91E63'
                              }
                            }}
                          >
                            {copiedMessage ? (
                              <CheckCircleOutlined style={{ fontSize: 16, color: '#4caf50' }} />
                            ) : (
                              <CopyOutlined style={{ fontSize: 16 }} />
                            )}
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                      <Typography variant="body2" sx={{ color: '#757575' }}>
                        No webhook URL configured
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Update Webhook Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {merchant?.webhook ? 'Update Webhook URL' : 'Add Webhook URL'}
          </Typography>
          <Typography variant="body2" sx={{ color: '#757575', mt: 0.5 }}>
            Enter your webhook endpoint URL
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            fullWidth
            label="Webhook URL"
            placeholder="https://api.example.com/webhook"
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
            disabled={updating}
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
            disabled={updating}
            sx={{
              color: '#616161',
              textTransform: 'none',
              fontWeight: 500
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdateWebhook}
            variant="contained"
            disabled={updating}
            sx={{
              bgcolor: '#E91E63',
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              borderRadius: 2,
              '&:hover': { bgcolor: '#C2185B' }
            }}
          >
            {updating ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              merchant?.webhook ? 'Update Webhook' : 'Add Webhook'
            )}
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