new Promise((resolve, reject) => {
    someAsynchronousWork((result, error) => {
        if (error) {
            reject(error);
            return;
        }
        resolve(result);
    });
});
