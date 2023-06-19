interface GamesState {
  monthGameData?: any;
  loading: boolean;
  error?: SerializedError;
  currentDate: Date;
  currentLeague: string;
  currentSeason: string;
  selectedEvent?: GameData;
}