function wait(duration) {
    return new Promise((resolve) => {
        setTimeout(resolve, duration);
    });
}

const timeoutPromise = wait(1000);

// thenable
timeoutPromise.then(() => {
    console.log('1 second later!');
});
