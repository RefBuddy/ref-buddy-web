import React, { FC } from 'react';
import { ClipboardIcon } from '@heroicons/react/24/solid';
import { Typography, LinearProgress, Box } from '@mui/material';

interface OverviewGameReportsProps {
  progress: number;
  value: string;
}

const OverviewGameReports: FC<OverviewGameReportsProps> = ({ progress, value }) => {
  return (
    <div className="flex items-center justify-center gap-3 border-gray-200 border-solid border rounded-lg shadow-sm px-4 mx-4" style={{ height: '180px', width: '215px' }}>
      <div className="flex flex-1 flex-col items-start justify-center gap-3">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <Typography
            color="text.secondary"
            variant="overline"
          >
            Game Reports
          </Typography>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <ClipboardIcon className="w-14 h-14 text-green-500" />
          </div>
        </div>
        <Typography variant="h4">
          {value}
        </Typography>
        <Box sx={{ mt: 3, width: '100%' }}>
          <LinearProgress
            value={progress}
            variant="determinate"
          />
        </Box>
      </div>
    </div>
  );
};

export default OverviewGameReports;
