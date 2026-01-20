import { useState } from 'react';
import {
  Grid,
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
  Alert
} from '@mui/material';

import {
  KeyOutlined,
  ApiOutlined,
  SafetyOutlined,
  PlusOutlined,
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import APIKeysManager from './developer/ApikeysManager';
import WebhooksManager from './developer/WebhooksManager';
import IPWhitelistManager from './developer/IPWhitelistManager';

export default function DeveloperSettings() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8f9fa', p: { xs: 2, sm: 3, md: 4 } }}>
      <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
        {/* Page Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#212121', mb: 1 }}>
            Developer Settings
          </Typography>
          <Typography variant="body1" sx={{ color: '#616161' }}>
            Manage API keys, webhooks, and security configurations
          </Typography>
        </Box>

        {/* Content */}
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <APIKeysManager />
          </Grid>
          <Grid item xs={12}>
            <WebhooksManager />
          </Grid>
          <Grid item xs={12}>
            <IPWhitelistManager />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}