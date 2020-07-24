String.__proto__.splitReq = function () {
    let s = this;
    let o = {};
    s.split('\n').forEach(function (ss) {
        let sss = ss.split(':');
        o[sss[0].trim()] = sss[1].trim();
    });
    return o;
}