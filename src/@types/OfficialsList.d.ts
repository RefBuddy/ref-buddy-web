interface OfficialsListState {
    officialsList: {
        [uid: string]: OfficialData
    };
    supervisorsList: {
        [uid: string]: OfficialData
    };
    loading: boolean;
    error?: SerializedError;
}