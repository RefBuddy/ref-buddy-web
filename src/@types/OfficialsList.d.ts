interface OfficialsListState {
    officialsList: {
        [uid: string]: OfficialData
    };
    loading: boolean;
    error?: SerializedError;
}