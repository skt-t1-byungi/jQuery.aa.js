import $ from 'jquery';
import EventEmitter from 'wolfy87-eventemitter';
import dots from 'dot-notes';

let userData = {};

export default class extends EventEmitter {
    on(...params) {
        if ($.isPlainObject(params[0])) {
            const paramsObj = params[0];

            for (let i in paramsObj) {
                super.on(i, paramsObj[i]);
            }

        } else {
            super.on(...params);
        }

        return this;
    }

    get(key = null) {
        if (key) {
            return dots.get(userData, key);
        }

        return userData;
    }

    set(key, val) {
        if ($.isPlainObject(key)) {
            for (let i in key) {
                this.set(i, key[i]);
            }
        } else {
            dots.create(userData, key, val);
        }

        return this;
    }
}