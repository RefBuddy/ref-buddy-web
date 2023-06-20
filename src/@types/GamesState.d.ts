interface GamesState {
  monthGameData?: MonthGameData;
  officialsData?: OfficialsData;
  loading: boolean;
  error?: SerializedError;
  currentDate: string;
  currentLeague: string;
  currentSeason: string;
  selectedEvent?: GameData;
  selectedGames: GameData[];
}