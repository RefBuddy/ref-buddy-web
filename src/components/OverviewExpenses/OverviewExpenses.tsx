import React, { FC } from 'react';
import { ArrowDownIcon, ArrowUpIcon, CurrencyDollarIcon } from '@heroicons/react/24/solid';

interface OverviewExpensesProps {
  difference?: number;
  positive?: boolean;
  value: string;
}

const OverviewExpenses: FC<OverviewExpensesProps> = ({ difference, positive = false, value }) => {
  return (
    <div className="flex items-center justify-center gap-3 border-gray-200 border-solid border rounded-lg shadow-sm px-4 mx-4 h-48 w-56">
      <div className="flex flex-1 flex-col items-start justify-center gap-3">
        <div className="flex justify-between items-center w-full">
          <h6 className="text-gray-700 text-sm font-medium uppercase">
            Expenses
          </h6>
          <CurrencyDollarIcon className="w-14 h-14 text-green-500" />
        </div>
        <h4 className="text-lg font-semibold">
          {value}
        </h4>
        {difference && (
          <div className="flex flex-row items-center gap-1">
            <div className="flex flex-row items-center gap-0.5">
              {positive ? <ArrowUpIcon className="h-5 w-5 text-green-500" /> : <ArrowDownIcon className="h-5 w-5 text-red-500" />}
              <span className={`text-sm ${positive ? 'text-green-500' : 'text-red-500'}`}>
                {difference}%
              </span>
            </div>
            <span className="text-gray-700 text-xs">
              Since last month
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default OverviewExpenses;