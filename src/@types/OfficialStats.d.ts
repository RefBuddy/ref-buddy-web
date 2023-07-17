interface StatCollection {
    average_goals: number;
    average_infractions: number;
    average_penalty_minutes: number;
    average_power_plays: number;
    extra_time_games: number;
    games: number;
    jersey_number: number;
    name: string;
    role: string;
    total_home_infractions: number;
    total_home_wins: number;
    total_visiting_infractions: number;
    total_visiting_wins: number;
}

interface OfficialStats {
    linesmanStats?: StatCollection;
    refereeStats?: StatCollection;
}