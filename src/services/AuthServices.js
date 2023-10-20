export const getCurrentUser = () => {
    const user = JSON.parse(sessionStorage.getItem('userSession'));
    return user;
}

export const authHeader = () => {
    const user = JSON.parse(sessionStorage.getItem('userSession'));
    if (user && user.accessToken) {
        return { Authorization: 'Bearer ' + user.accessToken };
    } else {
        return {};
    }
}
