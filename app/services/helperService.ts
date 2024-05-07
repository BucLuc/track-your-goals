function getUserName(user: any){
    return user.displayName ? user.displayName : user.email
}

export {getUserName}