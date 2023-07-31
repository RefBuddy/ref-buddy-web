import React from 'react';
import { useAppSelector } from '../../../../store';
import { OfficialBox } from './OfficialBox';

const GameAssignment = ({ gameData }) => {
  // Fetch officialsData from the global state
  const officialsData = useAppSelector(state => state.games.officialsData);
  
  // Retrieve the officials for this specific game
  const gameOfficialsData = officialsData ? officialsData[gameData.id] : null;

  // Create a new object to store the officials by their role
  const officialsByRole = {};

  // Loop through game officials
  for (let gameOfficial of gameData.officials) {
    // Check if uid matches
    for (let officialKey in gameOfficialsData) {
      const official = gameOfficialsData[officialKey];
      if (official && official.uid === gameOfficial.uid) {
        officialsByRole[gameOfficial.role] = official;
        break;
      }
    }
  }

  return (
    <div className="flex flex-row flex-wrap w-full gap-1">
      <OfficialBox official={officialsByRole["referee1"]} gameData={gameData} role="referee1" label="Referee" color="orange" />
      <OfficialBox official={officialsByRole["referee2"]} gameData={gameData} role="referee2" label="Referee" color="orange" />
      <OfficialBox official={officialsByRole["linesman1"]} gameData={gameData} role="linesman1" label="Linesman" color="black" />
      <OfficialBox official={officialsByRole["linesman2"]} gameData={gameData} role="linesman2" label="Linesman" color="black" />
    </div>
  );
};

export default GameAssignment;
