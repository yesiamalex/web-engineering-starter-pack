console.log('3');

setTimeout(1000)
    .then(() => {
        console.log('2');

        return setTimeout(1000);
    })
    .then(() => {
        console.log('1');

        return setTimeout(1000);
    })
    .then(() => {
        console.log('Happy New Year!!');
    });
