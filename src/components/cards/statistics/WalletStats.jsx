import PropTypes from 'prop-types';
// material-ui
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

// project imports
import MainCard from 'components/MainCard';

// assets
import WalletOutlined from '@ant-design/icons/WalletOutlined';
import CreditCardOutlined from '@ant-design/icons/CreditCardOutlined';

export default function WalletBalance({
    color = 'primary',
    title = 'Wallet Balance',
    count,
    cardHolder = 'Card Holder',
    cardNumber = '**** **** **** 1234'
}) {
    const theme = useTheme();

    const colorMap = {
        primary: {
            gradient: 'linear-gradient(135deg, #2B3E8F 0%, #E31E52 50%, #2B3E8F 100%)',
            chipGradient: 'linear-gradient(135deg, #ffd89b 0%, #E31E52 100%)',
            accent: '#E31E52'
        },
        navy: {
            gradient: 'linear-gradient(135deg, #1a2847 0%, #2B3E8F 100%)',
            chipGradient: 'linear-gradient(135deg, #ffd89b 0%, #E31E52 100%)',
            accent: '#2B3E8F'
        },
        pink: {
            gradient: 'linear-gradient(135deg, #c91d4f 0%, #E31E52 100%)',
            chipGradient: 'linear-gradient(135deg, #ffd89b 0%, #2B3E8F 100%)',
            accent: '#2B3E8F'
        },
        blinkpe: {
            gradient: 'linear-gradient(135deg, #2B3E8F 0%, #1a2560 50%, #E31E52 100%)',
            chipGradient: 'linear-gradient(135deg, #E31E52 0%, #ffd89b 100%)',
            accent: '#E31E52'
        }
    };

    const currentColor = colorMap[color] || colorMap.primary;

    // Format balance with Indian number system
    const formatBalance = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2
        }).format(amount);
    };

    return (
        <MainCard
            contentSX={{
                p: 0,
                position: 'relative',
                overflow: 'hidden',
                background: currentColor.gradient,
                minHeight: '160px',
                maxWidth: '350px',
                borderRadius: '16px',
                boxShadow: '0 15px 40px rgba(0, 0, 0, 0.3)',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: '-50%',
                    right: '-20%',
                    width: '250px',
                    height: '250px',
                    background: 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
                    animation: 'float 8s ease-in-out infinite'
                },
                '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: '-40%',
                    left: '-15%',
                    width: '180px',
                    height: '180px',
                    background: 'radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, transparent 70%)',
                    animation: 'float 10s ease-in-out infinite reverse'
                },
                '@keyframes float': {
                    '0%, 100%': {
                        transform: 'translateY(0) translateX(0) scale(1)'
                    },
                    '50%': {
                        transform: 'translateY(-30px) translateX(20px) scale(1.1)'
                    }
                },
                '@keyframes shine': {
                    '0%': {
                        left: '-100%'
                    },
                    '100%': {
                        left: '100%'
                    }
                },
                '@keyframes pulse': {
                    '0%, 100%': {
                        opacity: 1
                    },
                    '50%': {
                        opacity: 0.8
                    }
                }
            }}
        >
            <Box
                sx={{
                    position: 'relative',
                    zIndex: 1,
                    width: '100%',
                    p: 2.5,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                }}
            >
                {/* Card Top Section */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    {/* Bank Logo / Title */}
                    <Box>
                        <Typography
                            variant="h6"
                            sx={{
                                color: '#fff',
                                fontWeight: 700,
                                fontSize: '0.95rem',
                                letterSpacing: 1.5,
                                textTransform: 'uppercase',
                                textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
                            }}
                        >
                            BlinkPé
                        </Typography>
                        <Typography
                            variant="caption"
                            sx={{
                                color: 'rgba(255, 255, 255, 0.8)',
                                fontSize: '0.6rem',
                                letterSpacing: 0.8
                            }}
                        >
                            DIGITAL WALLET
                        </Typography>
                    </Box>

                    {/* Contactless Icon */}
                    <Box
                        sx={{
                            width: 38,
                            height: 38,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transform: 'rotate(-90deg)'
                        }}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round"/>
                            <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round"/>
                            <path d="M12 12C12.5523 12 13 11.5523 13 11C13 10.4477 12.5523 10 12 10" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                    </Box>
                </Box>

                {/* EMV Chip */}
                <Box sx={{ mt: 1.5 }}>
                    <Box
                        sx={{
                            width: 42,
                            height: 32,
                            borderRadius: '5px',
                            background: currentColor.chipGradient,
                            position: 'relative',
                            boxShadow: '0 3px 12px rgba(0, 0, 0, 0.3)',
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                inset: '4px',
                                borderRadius: '4px',
                                background: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.1) 0px, rgba(255,255,255,0.1) 2px, transparent 2px, transparent 4px)',
                            },
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                inset: '4px',
                                borderRadius: '4px',
                                background: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.1) 0px, rgba(255,255,255,0.1) 2px, transparent 2px, transparent 4px)',
                            }
                        }}
                    />
                </Box>

              
                {/* Balance Section */}
                <Box sx={{ mt: 2 }}>
                    <Typography
                        variant="caption"
                        sx={{
                            color: 'rgba(255, 255, 255, 0.8)',
                            fontSize: '0.65rem',
                            letterSpacing: 1,
                            textTransform: 'uppercase',
                            display: 'block',
                            mb: 0.5
                        }}
                    >
                        Available Balance
                    </Typography>
                    <Typography
                        variant="h3"
                        sx={{
                            color: '#fff',
                            fontWeight: 700,
                            fontSize: '2rem',
                            letterSpacing: '-0.5px',
                            textShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                            display: 'flex',
                            alignItems: 'baseline',
                            gap: 0.5
                        }}
                    >
                        <Box component="span" sx={{ fontSize: '1.3rem', fontWeight: 600 }}>
                            ₹
                        </Box>
                        {formatBalance(count)}
                    </Typography>
                </Box>

            </Box>

            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '50%',
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                    animation: 'shine 3s infinite',
                    transform: 'skewX(-20deg)',
                    zIndex: 2,
                    pointerEvents: 'none'
                }}
            />
        </MainCard>
    );
}

WalletBalance.propTypes = {
    color: PropTypes.string,
    title: PropTypes.string,
    balance: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    cardHolder: PropTypes.string,
    cardNumber: PropTypes.string
};