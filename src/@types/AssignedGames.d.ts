
interface FirebaseGameData {
  ID: string;
  Parent: FirebaseGameData;
  Path: string;
}

interface AssignedGames {
  [date: string]: FirebaseGameData[];
}