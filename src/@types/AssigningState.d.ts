interface AssigningState {
    assigningStatus: boolean;
    loading: boolean;
    releaseSuccessful: boolean;
    error?: string | null;
}