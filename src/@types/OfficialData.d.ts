interface OfficialData {
    address: string;
    city: string;
    email: string;
    firstName: string;
    lastName: string;
    leagues: string[];
    phoneNumber: string;
    profilePictureUrl: string;
    uid: string;
    queueCount?: number;
    assignedCount?: number;
    role: {
        referee: boolean;
        linesman: boolean;
    }
}