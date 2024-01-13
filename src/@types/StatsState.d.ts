interface StatsState {
  stats: {
    [uid: string]: number;
  };
  loading: boolean;
  error?: SerializedError;
}
