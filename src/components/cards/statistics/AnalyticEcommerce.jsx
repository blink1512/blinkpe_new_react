import PropTypes from 'prop-types';
// material-ui
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import { useTheme } from '@mui/material/styles';

// project imports
import MainCard from 'components/MainCard';

// assets
import RiseOutlined from '@ant-design/icons/RiseOutlined';
import FallOutlined from '@ant-design/icons/FallOutlined';
import NumberOutlined from '@ant-design/icons/NumberOutlined';
import DollarOutlined from '@ant-design/icons/DollarOutlined';

const iconSX = { fontSize: '0.75rem', color: 'inherit', marginLeft: 0, marginRight: 0 };

export default function AnalyticEcommerce({ 
  color = 'primary', 
  title, 
  count, 
  txnValue, 
  percentage, 
  isLoss, 
  extra,
  countTooltip = 'Total number of transactions',
  txnValueTooltip = 'Total transaction value',
  showOnlyInRange = false // New prop to control conditional rendering
}) {
  const theme = useTheme();
  
  const colorMap = {
    primary: { 
      main: '#1976d2', 
      light: '#42a5f5', 
      gradient: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
      bg: 'rgba(25, 118, 210, 0.08)'
    },
    success: { 
      main: '#2e7d32', 
      light: '#66bb6a', 
      gradient: 'linear-gradient(135deg, #2e7d32 0%, #66bb6a 100%)',
      bg: 'rgba(46, 125, 50, 0.08)'
    },
    warning: { 
      main: '#ed6c02', 
      light: '#ff9800', 
      gradient: 'linear-gradient(135deg, #ed6c02 0%, #ff9800 100%)',
      bg: 'rgba(237, 108, 2, 0.08)'
    },
    error: { 
      main: '#d32f2f', 
      light: '#f44336', 
      gradient: 'linear-gradient(135deg, #d32f2f 0%, #f44336 100%)',
      bg: 'rgba(211, 47, 47, 0.08)'
    }
  };

  const currentColor = colorMap[color] || colorMap.primary;

  // Helper function to check if value is 6-7 digits
  const isInRange = (value) => {
    if (!value && value !== 0) return false;
    const numStr = String(value).replace(/[^0-9]/g, ''); // Remove non-numeric characters
    const length = numStr.length;
    return length >= 6 && length <= 7;
  };

  // Check if both count and txnValue are in 6-7 digit range
  const shouldShow = isInRange(count) && isInRange(txnValue);

  // Debug log - remove this after testing
 

  // If showOnlyInRange is true and values are not in range, don't render
  if (showOnlyInRange && !shouldShow) {
    return null;
  }

  return (
    <MainCard 
      contentSX={{ 
        p: 2.5,
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          transform: 'translateY(-6px)',
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: currentColor.gradient,
          transform: 'scaleX(0)',
          transformOrigin: 'left',
          transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        },
        '&:hover::before': {
          transform: 'scaleX(1)',
        }
      }}
    >
      <Stack spacing={2}>
        {/* Header with Title */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Typography 
            variant="h6" 
            color="text.secondary"
            sx={{
              fontWeight: 600,
              fontSize: '0.875rem',
              letterSpacing: 0.5,
              textTransform: 'uppercase',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            {title}
          </Typography>
          {/* Debug badge - remove after testing */}
          
        </Box>

        {/* Main Content - Single Row */}
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          {/* Count Section */}
          <Tooltip 
            title={countTooltip} 
            arrow 
            placement="top"
            componentsProps={{
              tooltip: {
                sx: {
                  bgcolor: 'grey.900',
                  fontSize: '0.75rem',
                  py: 1,
                  px: 1.5,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }
              }
            }}
          >
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1.5,
                p: 1.5,
                borderRadius: 2,
                background: currentColor.bg,
                transition: 'all 0.3s ease',
                cursor: 'help',
                flex: 1,
                '&:hover': {
                  background: currentColor.gradient,
                  '& .icon': {
                    transform: 'rotate(360deg) scale(1.1)',
                    background: 'rgba(255,255,255,0.2) !important',
                    '& svg': {
                      color: '#fff !important'
                    }
                  },
                  '& .count': {
                    color: '#fff !important',
                    transform: 'scale(1.05)'
                  },
                  '& .label': {
                    color: 'rgba(255,255,255,0.9) !important'
                  }
                }
              }}
            >
              <Box
                className="icon"
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#fff',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  transition: 'all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                  color: currentColor.main
                }}
              >
                <NumberOutlined style={{ fontSize: '1.25rem' }} />
              </Box>
              <Box>
                <Typography 
                  className="count"
                  variant="h5" 
                  sx={{ 
                    fontWeight: 500,
                    color: currentColor.main,
                    transition: 'all 0.3s ease',
                    lineHeight: 1.2
                  }}
                >
                  {count}
                </Typography>
                <Typography 
                  className="label"
                  variant="caption" 
                  sx={{ 
                    color: 'text.secondary',
                    fontWeight: 500,
                    fontSize: '0.7rem',
                    transition: 'color 0.3s ease'
                  }}
                >
                </Typography>
              </Box>
            </Box>
          </Tooltip>

          {/* Value Section */}
          <Tooltip 
            title={txnValueTooltip} 
            arrow 
            placement="top"
            componentsProps={{
              tooltip: {
                sx: {
                  bgcolor: 'grey.900',
                  fontSize: '0.75rem',
                  py: 1,
                  px: 1.5,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }
              }
            }}
          >
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1.5,
                p: 1.5,
                borderRadius: 2,
                background: currentColor.bg,
                transition: 'all 0.3s ease',
                cursor: 'help',
                flex: 1,
                '&:hover': {
                  background: currentColor.gradient,
                  '& .icon': {
                    transform: 'rotate(360deg) scale(1.1)',
                    background: 'rgba(255,255,255,0.2) !important',
                    '& svg': {
                      color: '#fff !important'
                    }
                  },
                  '& .value': {
                    color: '#fff !important',
                    transform: 'scale(1.05)'
                  },
                  '& .label': {
                    color: 'rgba(255,255,255,0.9) !important'
                  }
                }
              }}
            >
              <Box
                className="icon"
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#fff',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  transition: 'all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                  color: currentColor.main
                }}
              >
                <DollarOutlined style={{ fontSize: '1.25rem' }} />
              </Box>
              <Box>
                <Typography 
                  className="value"
                  variant="h5" 
                  sx={{ 
                    fontWeight: 600,
                    color: currentColor.main,
                    transition: 'all 0.3s ease',
                    lineHeight: 1.2
                  }}
                >
                  ₹{txnValue}
                </Typography>
                <Typography 
                  className="label"
                  variant="caption" 
                  sx={{ 
                    color: 'text.secondary',
                    fontWeight: 300,
                    fontSize: '0.1rem',
                    transition: 'color 0.3s ease'
                  }}
                >
                 
                </Typography>
              </Box>
            </Box>
          </Tooltip>
        </Box>
      </Stack>
    </MainCard>
  );
}

AnalyticEcommerce.propTypes = {
  color: PropTypes.string,
  title: PropTypes.string,
  count: PropTypes.string,
  txnValue: PropTypes.string,
  countTooltip: PropTypes.string,
  txnValueTooltip: PropTypes.string,
  showOnlyInRange: PropTypes.bool
};