import React from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/solid';

const DarkDayCard = ({ datesAlreadyblockedOff, format24HourTime }) => (
    <div className="flex flex-col gap-2">
        {datesAlreadyblockedOff.map((times, index) => (
            <React.Fragment key={index}>
                <div className="flex items-center gap-2">
                    {times.startTime === '00:00' && times.endTime === '23:59' ? (
                        <p className="h-6 w-6 text-warning-300">❌</p>
                    ) : (
                        <ExclamationTriangleIcon className="h-6 w-6 text-warning-300" />
                    )}
                    <div>
                        <p className="text-sm font-medium text-black">
                            {times.startTime === '00:00' && times.endTime === '23:59' ? (
                                <span className="text-gray-700">Not Available</span>
                            ) : (
                                <span className="text-gray-700">
                                    {format24HourTime(times.startTime)} -{' '}
                                    {format24HourTime(times.endTime)}
                                </span>
                            )}
                            <br />
                            <span className="text-gray-700">{times.notes}</span>
                        </p>
                    </div>
                </div>
            </React.Fragment>
        ))}
    </div>
);

export default DarkDayCard;