function wait(duration) {
    return new Promise((resolve) => {
        setTimeout(resolve, duration);
    });
}

await wait(1000)
    .then(() => {
        console.log('2');
        return wait(1000);
    })
    .then(() => {
        console.log('1');
        return wait(1000);
    })
    .then(() => {
        console.log('Happy New Year!!');
    });

console.log(123);
