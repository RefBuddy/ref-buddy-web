interface UserState {
    user?: User;
    loading: boolean;
    error: any;
    assignedGames?: {
      [key: string]: ResolvedGame[];
    };
    queuedGames?: {
      [key: string]: ResolvedGame[];
    };
    blockedOffTimes?: {
      [key: string]: any;
    };
    userDocData: {};
    officialsStats?: OfficialStats | null;
    userGames: {};
    officialsCalendarData: {};
    currentLeague: string;
    currentSeason: string;
  }