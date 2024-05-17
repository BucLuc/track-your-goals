function getUserName(user: any){
    return user.displayName ? user.displayName : user.email
}

function AvatarToImageURL(avatar: string){
    return `/img/Avatars/${avatar}-avatar.png`
}

export {getUserName, AvatarToImageURL}