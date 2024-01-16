interface OfficialsListState {
  officialsList: {
    [uid: string]: OfficialData;
  };
  supervisorsList: {
    [uid: string]: OfficialData;
  };
  invitedUsers: InviteUserRequestData[];
  loading: boolean;
  error?: SerializedError;
}
