import { weekDays } from "../config/config";

function getUserName(user: any) {
    return user.displayName ? user.displayName : user.email
}

function AvatarToImageURL(avatar: string) {
    return `/img/Avatars/${avatar}-avatar.png`
}

function GetActivitySummary(week: any) {
    const combinedDictionary: any = {};

    for (const day in week) {
        if (week.hasOwnProperty(day)) {
            if (weekDays.includes(day)) {
                week[day].forEach((activity: any) => {
                    if (!combinedDictionary[activity.name]) {
                        combinedDictionary[activity.name] = {
                            actualAmount: 0,
                            plannedAmount: 0,
                            unit: activity.unit
                        };
                    }
                    combinedDictionary[activity.name].actualAmount += activity.actualAmount ? Number(activity.actualAmount) : 0;
                    combinedDictionary[activity.name].plannedAmount += activity.plannedAmount ? Number(activity.plannedAmount) : 0;
                });
            }
        }

    }
    return combinedDictionary
}

function successfulWeek (week: any) {
    let successful = true

    for (const day in week) {
        if (weekDays.includes(day)) {
            for (const activity in week[day]){
                if (Number(week[day][activity].plannedAmount) > Number(week[day][activity].actualAmount)) {
                    successful = false
                } 
            }   
        } 
    }
    
    return successful
}

export { getUserName, AvatarToImageURL, GetActivitySummary, successfulWeek }