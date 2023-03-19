export interface CovidCaseType {
    date: string
    totalCase: number
}

export interface PageProps {
    token: string
}

export interface RoomType {
    room_id: number;
    building_name: string;
    room_number: string;
    totalUserVisited: number;
    userVisited: any[]; // You can replace 'any' with the interface of User, if you have defined it already
    userVisitedByIds: any[]
}

export interface NotificationType {
    createdAt: string;
    id: number;
    notification_description: string;
    notification_for: number;
    notification_is_viewed: number;
    notification_source: string;
    notification_title: string;
    notification_type: string;
    updatedAt: string;
}