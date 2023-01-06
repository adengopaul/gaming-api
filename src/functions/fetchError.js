module.exports = function checkStatus(res) {
    if (res.ok) { // res.status >= 200 && res.status < 300
        return res;
    } else {
        console.log({res})
        throw new Error(res.statusText);
    }
}
