interface GamesState {
  monthGameData?: MonthGameData;
  loading: boolean;
  error?: SerializedError;
  currentDate: string;
  currentLeague: string;
  currentSeason: string;
  selectedEvent?: GameData;
  selectedGames: GameData[];
}