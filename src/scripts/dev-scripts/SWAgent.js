function SWAgent() {
}

SWAgent.sendMessage = function (message) {
    // This wraps the message posting/response in a promise, which will
    // resolve if the response doesn't contain an error, and reject with
    // the error if it does. If you'd prefer, it's possible to call
    // controller.postMessage() and set up the onmessage handler
    // independently of a promise, but this is a convenient wrapper.
    return new Promise(function (resolve, reject) {
        var messageChannel = new MessageChannel();
        messageChannel.port1.onmessage = function (event) {
            if (event.data.error) {
                reject(event.data.error);
            } else {
                resolve(event.data);
            }
        };

        // This sends the message data as well as transferring
        // messageChannel.port2 to the service worker.
        // The service worker can then use the transferred port to reply
        // via postMessage(), which will in turn trigger the onmessage
        // handler on messageChannel.port1.
        // See
        // https://html.spec.whatwg.org/multipage/workers.html#dom-worker-postmessage

        if (navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage(message, [messageChannel.port2]);
        } else {
            navigator.serviceWorker.oncontrollerchange = function () {
                navigator.serviceWorker.controller.postMessage(message, [messageChannel.port2]);
            };
        }

    });
};

SWAgent.restoreDossier = function (seed, url, callback) {
    SWAgent.sendMessage({action: "activate"}).then((data) => {
        if (data.status === "empty") {
            SWAgent.sendMessage({seed: seed, url: url}).then(data => {
                callback(undefined);
            }).catch(err => {
                console.log(err);
                callback(err);
            })

        }
    }).catch(err => {
        callback(err);
    });
};


SWAgent.unregisterSW = function () {
    navigator.serviceWorker.getRegistrations().then(function (registrations) {
        for (let registration of registrations) {
            registration.unregister().then(function (success) {
                if ('caches' in window) {
                    caches.keys()
                        .then(function (keyList) {
                            return Promise.all(keyList.map(function (key) {
                                return caches.delete(key);
                            }));
                        })
                }

            })
        }
    });
}


export default SWAgent;




