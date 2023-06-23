import React, { FC } from 'react';
import { ArrowDownIcon, ArrowUpIcon, CurrencyDollarIcon } from '@heroicons/react/24/solid';
import { Typography } from '@mui/material';

interface OverviewBudgetProps {
  difference?: number;
  positive?: boolean;
  value: string;
}

const OverviewBudget: FC<OverviewBudgetProps> = ({ difference, positive = false, value }) => {
  return (
    <div className="flex items-center justify-center gap-3 border-gray-200 border-solid border rounded-lg shadow-sm px-4 mx-4" style={{ height: '180px', width: '215px' }}>
      <div className="flex flex-1 flex-col items-start justify-center gap-3">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <Typography
            color="text.secondary"
            variant="overline"
          >
            Budget
          </Typography>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <CurrencyDollarIcon className="w-14 h-14 text-green-500" />
          </div>
        </div>
        <Typography variant="h4">
          {value}
        </Typography>
        {difference && (
          <div className="flex flex-row items-center gap-1">
            <div className="flex flex-row items-center gap-0.5">
              {positive ? <ArrowUpIcon className="h-5 w-5 text-green-500" /> : <ArrowDownIcon className="h-5 w-5 text-red-500" />}
              <Typography
                color={positive ? 'success.main' : 'error.main'}
                variant="body2"
              >
                {difference}%
              </Typography>
            </div>
            <Typography
              color="text.secondary"
              variant="caption"
            >
              Since last month
            </Typography>
          </div>
        )}
      </div>
    </div>
  );
};

export default OverviewBudget;