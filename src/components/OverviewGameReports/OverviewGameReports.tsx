import React, { FC } from 'react';
import { ClipboardIcon } from '@heroicons/react/24/solid';

interface OverviewGameReportsProps {
  progress: number;
  value: string;
}

const OverviewGameReports: FC<OverviewGameReportsProps> = ({
  progress,
  value,
}) => {
  return (
    <div className="flex items-center justify-center gap-3 border-gray-200 border-solid border rounded-lg shadow-sm px-4 mx-4 h-48 w-56">
      <div className="flex flex-1 flex-col items-start justify-center gap-3">
        <div className="flex justify-between items-center w-full">
          <h6 className="text-gray-700 text-sm font-medium uppercase">
            Game Reports
          </h6>
          <ClipboardIcon className="w-14 h-14 text-black" />
        </div>
        <h4 className="text-lg font-semibold">{value}</h4>
        <div className="mt-3 w-full">
          <div className="h-1 w-full bg-gray-300 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewGameReports;
