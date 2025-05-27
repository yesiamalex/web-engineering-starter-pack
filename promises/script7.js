function getUser(userId) {
    return new Promise((resolve, reject) => {
        // The asynchronous work, in this case, is
        // looking up a user from their ID
        try {
            db.get({ id: userId }, (user) => {
                // Now that we have the full user object,
                // we can pass it in here...
                resolve(user);
            });
        } catch (e) {
            reject("This doesn't work ");
        }
    });
}
getUser('abc123').then((user) => {
    // ...and pluck it out here!
    console.log(user);
    // { name: 'Josh', ... }
});
