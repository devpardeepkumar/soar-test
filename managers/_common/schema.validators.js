module.exports = {
    'username': (data) => {
        if (data.trim().length < 3) {
            return false;
        }
        return true;
    },
    'email': () => {
        return true;
    },
    'schoolid': () => {
        return true;
    },
    'name': () => {
        return true;
    },
    'id': () => {
        return true;
    },
    
}