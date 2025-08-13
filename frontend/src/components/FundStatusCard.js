import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Avatar,
  useTheme
} from '@mui/material';
import {
  AccessibilityNew as AccessibilityIcon,
  Favorite as WishlistIcon,
  TrendingUp as ProgressIcon
} from '@mui/icons-material';

const FundStatusCard = ({ title, current, target, icon: IconName, color = 'primary' }) => {
  const progress = (current / target) * 100;
  const theme = useTheme();

  // Map icon names to actual icon components
  const getIcon = (iconName) => {
    switch (iconName) {
      case 'AccessibilityIcon':
        return AccessibilityIcon;
      case 'WishlistIcon':
        return WishlistIcon;
      case 'ProgressIcon':
        return ProgressIcon;
      default:
        return AccessibilityIcon;
    }
  };

  const Icon = getIcon(IconName);

  return (
    <Card sx={{ height: '100%', position: 'relative', overflow: 'visible' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar 
            sx={{ 
              bgcolor: theme.palette[color].light,
              color: theme.palette[color].main,
              width: 48,
              height: 48,
              mr: 2
            }}
          >
            <Icon />
          </Avatar>
          <Box>
            <Typography variant="h6" component="h2">
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Target: ₹{target.toLocaleString()}
            </Typography>
          </Box>
        </Box>
        <LinearProgress 
          variant="determinate" 
          value={progress} 
          sx={{ 
            height: 10, 
            borderRadius: 5, 
            mb: 1,
            bgcolor: theme.palette[color].lighter,
            '& .MuiLinearProgress-bar': {
              bgcolor: theme.palette[color].main
            }
          }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" color={theme.palette[color].main}>
            ₹{current.toLocaleString()}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {progress.toFixed(1)}% raised
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default FundStatusCard;

