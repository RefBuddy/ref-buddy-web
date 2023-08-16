interface GamesState {
  monthGameData?: MonthGameData;
  officialsData?: {
    [date: string]: OfficialsData;
  }
  loading: boolean;
  error?: SerializedError;
  currentDate: string;
  selectedEvent?: GameData;
  selectedGames: GameData[];
  savedNewGame: boolean;
  refetchCalendarEvents: boolean;
}