import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Chip,
} from "@mui/material";

const FALLBACK_IMG =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360">
      <rect width="100%" height="100%" fill="#e9edf3"/>
      <g fill="#9aa7b2" font-family="Arial,Helvetica,sans-serif" font-size="20" text-anchor="middle">
        <text x="50%" y="50%">Image not available</text>
      </g>
    </svg>`
  );

const SchemeDetailsModal = ({ open, scheme, onClose }) => {
  if (!scheme) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{scheme.name || scheme.title}</DialogTitle>
      <DialogContent dividers>
        <Box sx={{ display: "flex", gap: 3, flexDirection: { xs: "column", sm: "row" } }}>
          <Box
            component="img"
            src={scheme.image || FALLBACK_IMG}
            alt={scheme.name}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            onError={(e) => { e.currentTarget.src = FALLBACK_IMG; }}
            sx={{ width: { xs: "100%", sm: 280 }, borderRadius: 1, objectFit: "cover", backgroundColor: '#f5f6f8' }}
          />
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ mb: 2 }}>{scheme.description}</Typography>
            {scheme.benefits && (
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Benefits:</strong> {scheme.benefits}
              </Typography>
            )}
            {scheme.eligibility && (
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Eligibility:</strong> {scheme.eligibility}
              </Typography>
            )}
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 1 }}>
              {scheme.type && <Chip label={scheme.type} />}
              {scheme.disabilityType && <Chip label={scheme.disabilityType} color="secondary" />}
              {scheme.ageGroup && <Chip label={scheme.ageGroup} color="info" />}
              {scheme.location && <Chip label={scheme.location} />}
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        {scheme.applyLink && (
          <Button variant="contained" onClick={() => window.open(scheme.applyLink, "_blank")}>Apply</Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default SchemeDetailsModal;