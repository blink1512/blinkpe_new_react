import PropTypes from 'prop-types';
import { Link, useLocation, matchPath } from 'react-router-dom';

// material-ui
import useMediaQuery from '@mui/material/useMediaQuery';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project imports
import IconButton from 'components/@extended/IconButton';

import { handlerDrawerOpen, useGetMenuMaster } from 'api/menu';
import { useMerchant } from '../../../../../context/MerchantContext';

// BlinkPé Brand Colors - Enhanced
const BLINKPE_COLORS = {
  primary: '#E31E24',      // Red from "Pé"
  primaryLight: '#FFE5E7', // Very light red for hover
  primaryLighter: '#FFF5F5', // Lighter red for background
  secondary: '#2B4C9D',    // Blue from "Blink"
  secondaryLight: '#E8EDF7',
  text: '#2D3748',         // Darker text for better readability
  textLight: '#718096',    // Light text
  border: '#E2E8F0'        // Subtle border
};

// ==============================|| NAVIGATION - LIST ITEM ||============================== //

export default function NavItem({ item, level, isParents = false, setSelectedID }) {
  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster.isDashboardDrawerOpened;

  const downLG = useMediaQuery((theme) => theme.breakpoints.down('lg'));
  const { role } = useMerchant();
  
  if (item.roles && !item.roles.includes(role)) {
    return null;
  }
  
  let itemTarget = '_self';
  if (item.target) {
    itemTarget = '_blank';
  }

  const itemHandler = () => {
    if (downLG) handlerDrawerOpen(false);

    if (isParents && setSelectedID) {
      setSelectedID(item.id);
    }
  };

  const Icon = item.icon;
  const itemIcon = item.icon ? (
    <Icon
      style={{
        fontSize: drawerOpen ? '1.1rem' : '1.3rem',
        strokeWidth: 2,
        ...(isParents && { fontSize: 20, stroke: '1.5' })
      }}
    />
  ) : (
    false
  );

  const { pathname } = useLocation();
  const isSelected = !!matchPath({ path: item?.link ? item.link : item.url, end: false }, pathname);

  const textColor = isSelected ? BLINKPE_COLORS.secondary : BLINKPE_COLORS.text;
  const iconSelectedColor = BLINKPE_COLORS.secondary;

  return (
    <>
      <Box sx={{ position: 'relative', mb: 0.5 }}>
        <ListItemButton
          component={Link}
          to={item.url}
          target={itemTarget}
          disabled={item.disabled}
          selected={isSelected}
          sx={{
            zIndex: 1201,
            pl: drawerOpen ? `${level * 28}px` : 1.5,
            py: !drawerOpen && level === 1 ? 1.25 : 1.25,
            borderRadius: drawerOpen ? '8px' : '12px',
            mx: drawerOpen ? 1 : 0.5,
            transition: 'all 0.2s ease-in-out',
            ...(drawerOpen && {
              '&:hover': { 
                bgcolor: BLINKPE_COLORS.primaryLighter,
                transform: 'translateX(4px)'
              },
              '&.Mui-selected': {
                bgcolor: BLINKPE_COLORS.primaryLight,
                borderLeft: '3px solid',
                borderColor: BLINKPE_COLORS.primary,
                color: iconSelectedColor,
                fontWeight: 600,
                '&:hover': { 
                  color: iconSelectedColor, 
                  bgcolor: BLINKPE_COLORS.primaryLight,
                  transform: 'translateX(4px)'
                }
              }
            }),
            ...(!drawerOpen && {
              '&:hover': { 
                bgcolor: BLINKPE_COLORS.primaryLighter,
                transform: 'scale(1.05)'
              },
              '&.Mui-selected': { 
                '&:hover': { 
                  bgcolor: BLINKPE_COLORS.primaryLighter,
                  transform: 'scale(1.05)'
                }, 
                bgcolor: BLINKPE_COLORS.primaryLighter
              }
            })
          }}
          onClick={() => itemHandler()}
        >
          {itemIcon && (
            <ListItemIcon
              sx={{
                minWidth: drawerOpen ? 32 : 28,
                color: isSelected ? iconSelectedColor : BLINKPE_COLORS.textLight,
                transition: 'all 0.2s ease-in-out',
                ...(!drawerOpen && {
                  borderRadius: 2,
                  width: 40,
                  height: 40,
                  alignItems: 'center',
                  justifyContent: 'center',
                  '&:hover': { 
                    bgcolor: BLINKPE_COLORS.primaryLight,
                    color: iconSelectedColor
                  }
                }),
                ...(!drawerOpen &&
                  isSelected && {
                    bgcolor: BLINKPE_COLORS.primaryLight,
                    color: iconSelectedColor,
                    '&:hover': { bgcolor: BLINKPE_COLORS.primaryLight }
                  })
              }}
            >
              {itemIcon}
            </ListItemIcon>
          )}
          {(drawerOpen || (!drawerOpen && level !== 1)) && (
            <ListItemText
              primary={
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: textColor,
                    fontWeight: isSelected ? 600 : 500,
                    fontSize: '0.95rem',
                    letterSpacing: '0.01em'
                  }}
                >
                  {item.title}
                </Typography>
              }
            />
          )}
          {(drawerOpen || (!drawerOpen && level !== 1)) && item.chip && (
            <Chip
              color={item.chip.color}
              variant={item.chip.variant}
              size={item.chip.size}
              label={item.chip.label}
              avatar={item.chip.avatar && <Avatar>{item.chip.avatar}</Avatar>}
              sx={{
                height: 22,
                fontSize: '0.75rem',
                fontWeight: 600
              }}
            />
          )}
        </ListItemButton>
        {(drawerOpen || (!drawerOpen && level !== 1)) &&
          item?.actions &&
          item?.actions.map((action, index) => {
            const ActionIcon = action.icon;
            const callAction = action?.function;
            return (
              <IconButton
                key={index}
                {...(action.type === 'function' && {
                  onClick: (event) => {
                    event.stopPropagation();
                    callAction();
                  }
                })}
                {...(action.type === 'link' && {
                  component: Link,
                  to: action.url,
                  target: action.target ? '_blank' : '_self'
                })}
                color="secondary"
                variant="outlined"
                sx={{
                  position: 'absolute',
                  top: 12,
                  right: 24,
                  zIndex: 1202,
                  width: 24,
                  height: 24,
                  mr: -1,
                  ml: 1,
                  color: BLINKPE_COLORS.primary,
                  borderColor: isSelected ? BLINKPE_COLORS.primary : BLINKPE_COLORS.border,
                  borderRadius: '6px',
                  transition: 'all 0.2s ease',
                  '&:hover': { 
                    borderColor: BLINKPE_COLORS.primary,
                    bgcolor: BLINKPE_COLORS.primaryLighter,
                    transform: 'scale(1.1)'
                  }
                }}
              >
                <ActionIcon style={{ fontSize: '0.75rem' }} />
              </IconButton>
            );
          })}
      </Box>
    </>
  );
}

NavItem.propTypes = {
  item: PropTypes.any,
  level: PropTypes.number,
  isParents: PropTypes.bool,
  setSelectedID: PropTypes.oneOfType([PropTypes.any, PropTypes.func])
};