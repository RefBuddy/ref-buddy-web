import React, { useState, useEffect } from "react";
import { useAppSelector } from '../../store';

const OfficialsList: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [sortedData, setSortedData] = useState<any[]>([]);
    const officials = useAppSelector(state => state.officials.officialsList);

    // this hook converts the officials object to an array and sorts it when the component mounts
    useEffect(() => {
        const officialsArray = Object.keys(officials).map(key => officials[key]);
        const sortedOfficials = officialsArray.sort((a, b) => a.lastName.localeCompare(b.lastName));
        setSortedData(sortedOfficials);
    }, []);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        const searchTermLowerCase = e.target.value.toLowerCase();

        const officialsArray = Object.keys(officials).map(key => officials[key]);

        const filtered = officialsArray.filter(
            (official: any) =>
                official.firstName.toLowerCase().includes(searchTermLowerCase) ||
                official.lastName.toLowerCase().includes(searchTermLowerCase)
        );

        const sortedOfficials = filtered.sort((a: any, b: any) => a.lastName.localeCompare(b.lastName));
        setSortedData(sortedOfficials);
    };

    return (
        <div className="px-6 py-4">
            <div className="py-4">
                <input
                    type="text"
                    placeholder="Search officials..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {sortedData.map((official: any) => (
                    <div className="flex items-center p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800"
                        key={official.uid}>
                        <img className="w-10 h-10 rounded-full mr-4" src={official.profilePictureUrl} alt="official" />
                        <div>
                            <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                                {official.firstName} {official.lastName}
                            </p>
                            <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                                {official.city}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OfficialsList;
