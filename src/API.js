import $ from 'jquery';
import EventEmitter from 'wolfy87-eventemitter';
import helpers from 'helpers';

let userData = {
    _helper: helpers
};

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

    getData(key = null) {
        if (key) {
            return $.objectPath.get(userData, key);
        }

        return userData;
    }

    setData(key, val) {
        if ($.isPlainObject(key)) {
            for (let i in key) {
                this.setData(i, key[i]);
            }
        } else {
            $.objectPath.set(userData, key, val);
        }

        return this;
    }

    hasData(key) {
        return $.objectPath.has(userData, key);
    }
}