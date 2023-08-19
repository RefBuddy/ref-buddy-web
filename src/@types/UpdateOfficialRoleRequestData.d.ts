interface UpdateOfficialRoleRequestData {
    uid: string;
    role: {
        Referee: boolean;
        Linesman: boolean;
    };
    league: string;
}