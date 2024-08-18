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
    return combinedDictionary
}

export { getUserName, AvatarToImageURL, GetActivitySummary }