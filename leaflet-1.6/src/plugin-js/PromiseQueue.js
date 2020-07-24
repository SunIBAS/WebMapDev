/**
 * 编写目的
 * 将
 * a = init(function() {
 *     b = init(function() {
 *         c = init(function() {
 *             d = init(function() {
 *                 ...
 *             })
 *         })
 *     })
 * })
 * 转化为
 * let all = { a:null,b:null,c:null,d:null,... };
 * let init = function(tar,$this) {
 *     $this.obj[tar] = initFn();
 * }
 * let pq = new PromiseQueue(all)
 *          .add(init.bind(null,'a'));
 *          .add(init.bind(null,'b'));
 *          .add(init.bind(null,'c'));
 *          .add(init.bind(null,'d'))
 *          .setCallBack(() => {console.log('over')})
 *          .next();
 * */

class PromiseQueue {
    constructor(_obj) {
        this.obj = _obj;
        this.fns = [];
        this.callback = () => {console.log("over")};
    }

    setCallBack(cb) {
        this.callback = cb;
        return this;
    }

    next() {
        if (this.fns.length) {
            this.fns.shift()().then(this.next.bind(this));
        } else {
            this.callback();
        }
    }

    add(fn) {
        let tfn;
        if (!(fn instanceof Promise)) {
            tfn = () => {
                return new Promise((function (s) {
                    fn(this,s);
                }).bind(this));
            };
        } else {
            tfn = () => {
                return new Promise((function (s) {
                    fn(this).then(s);
                }).bind(this,fn));
            };
        }
        this.fns.push(tfn);
        return this;
    }
}