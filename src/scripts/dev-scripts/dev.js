import SWAgent from "./SWAgent.js"

const SEED = "6MJq7IyE9h%2FR9ay6%2FlXPBHw0vT5dxUGxIIVZ1PXKadw%3D%7CImh0dHA6Ly9sb2NhbGhvc3Q6ODA4MCI%3De";


let callback = function(err){
    if(err){
        throw err;
    }
    console.log("Dossier was restored")
};

setTimeout(()=>{
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/swHostBoot.js', {scope: "/"}).then(function (reg) {
        console.log('Yay, service worker is live!', reg);


            SWAgent.restoreDossier(SEED, window.location.origin, function (err) {
                if (err) {
                    SWAgent.unregisterSW();
                    return callback("Operation failed. Try again");
                }
                callback();
            });




    }).catch(function (err) {
        SWAgent.unregisterSW();
        return callback("Operation failed. Try again");
    });
}

},5000);
