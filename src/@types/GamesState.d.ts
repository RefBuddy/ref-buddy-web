interface GamesState {
  monthGameData?: MonthGameData;
  officialsData?: {
    [date: string]: OfficialsData;
  }
  loading: boolean;
  error?: SerializedError;
  currentDate: string;
  currentLeague: string;
  currentSeason: string;
  selectedEvent?: GameData;
  selectedGames: GameData[];
}