import React, { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from '../../store';
import { assignToGame } from '../../store/Games/actions';

const OfficialsList = ({ game, role }) => {
    const dispatch = useAppDispatch();
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [sortedData, setSortedData] = useState<any[]>([]);
    const officials = useAppSelector(state => state.officials.officialsList);
    const league = useAppSelector(state => state.games.currentLeague);
    const season = useAppSelector(state => state.games.currentSeason);
    const date = game.time.slice(0, 10);
    const gameNumber = game.gameNumber;

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
                official.lastName.toLowerCase().includes(searchTermLowerCase) ||
                official.city.toLowerCase().includes(searchTermLowerCase)
        );

        const sortedOfficials = filtered.sort((a: any, b: any) => a.lastName.localeCompare(b.lastName));
        setSortedData(sortedOfficials);
    };

    const handleOfficialClick = (uid: string) => {
        const gameData = {
          uid: uid,
          role: role,
          date: date,
          gameNumber: gameNumber,
          league: league,
          season: season,
        };

        // Dispatch the assignToGame action
        dispatch(assignToGame(gameData));
    };

    return (
        <div className="absolute z-10 w-60 bg-white border border-gray-300 rounded-md max-h-96 overflow-y-auto top-48 left-[-3rem]">
            <div className="py-4 px-3">
                <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                />
            </div>
            {sortedData.map((official: any, index) => (
                <div 
                key={official.uid} 
                className={`flex items-center p-2 ${index < sortedData.length - 1 ? 'border-b border-gray-200' : ''}`}
                onClick={() => handleOfficialClick(official.uid)}
                >
                    <img className="w-10 h-10 rounded-full mr-4" src={official.profilePictureUrl} alt="official" />
                    <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-600">
                        {official.firstName} {official.lastName}
                        </p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-300">
                        {official.city}
                        </p>
                    </div>
                </div>
            ))}
        </div>
      );      
};

export default OfficialsList;
