import React from 'react';
import { OfficialBox } from './OfficialBox';

const GameAssignment = ({ officialsData, gameData }) => {
  // Create a new object to store the officials by their role
  const officialsByRole = {};

  // Loop through game officials
  for (let gameOfficial of gameData.officials) {
    // Loop through officialsData
    for (let officialKey in officialsData) {
      const official = officialsData[officialKey];
      // Check if uid matches
      if (official && official.uid === gameOfficial.uid) {
        officialsByRole[gameOfficial.role] = official;
        break;
      }
    }
  }

  return (
    <div className="flex">
      <OfficialBox official={officialsByRole["referee1"]} game={gameData} role="referee1" label="Referee" color="orange" />
      <OfficialBox official={officialsByRole["referee2"]} game={gameData} role="referee2" label="Referee" color="orange" />
      <OfficialBox official={officialsByRole["linesman1"]} game={gameData} role="linesman1" label="Linesman" color="black" />
      <OfficialBox official={officialsByRole["linesman2"]} game={gameData} role="linesman2" label="Linesman" color="black" />
    </div>
  );
};

export default GameAssignment;