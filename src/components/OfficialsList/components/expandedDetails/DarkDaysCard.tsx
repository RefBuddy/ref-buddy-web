import React from 'react';
import { format24HourTime } from '../../../../utils/helpers';
import * as Utils from '../../utils';

const DarkDaysCard = ({ blockedOffTimes, date, currentDate }) => (
  <div className="h-auto">
    <p className="text-xs mt-4 font-bold">Dark Days</p>
    <table className="mt-2 max-h-[300px] h-auto overflow-y-auto w-full">
      <thead>
        <tr className="text-xs font-medium text-black">
          <td className="w-24">Date</td>
          <td className="w-16">Time</td>
          <td className="pl-4">Notes</td>
        </tr>
      </thead>
      <tbody>
        {blockedOffTimes &&
          Object.keys(blockedOffTimes)
            .filter(
              (dateKey) =>
                Utils.extractMonthYear(dateKey, currentDate) ===
                Utils.extractMonthYear(date, currentDate),
            )
            .map((dateKey) => (
              <>
                {blockedOffTimes[dateKey].map((block, index) => (
                  <tr
                    key={`block-${dateKey}-${index}`}
                    className="text-xs font-body text-gray-700"
                  >
                    <td>{dateKey}</td>
                    <td>
                      {block.startTime === '00:00' &&
                      block.endTime === '23:59' ? (
                        <p className="pl-4">❌</p>
                      ) : (
                        <span className="text-gray-700">
                          {format24HourTime(block.startTime)} -{' '}
                          {format24HourTime(block.endTime)}
                        </span>
                      )}
                    </td>
                    <td className="pl-4">{block.notes}</td>
                  </tr>
                ))}
              </>
            ))}
      </tbody>
    </table>
  </div>
);

export default DarkDaysCard;
