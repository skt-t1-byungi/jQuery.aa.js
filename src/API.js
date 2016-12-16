import $ from 'jquery';
import EventEmitter from 'wolfy87-eventemitter';
import helpers from 'helpers/template';
import regeistredTemplates from 'var/regeistredTemplates';
import mustache from 'mustache';

let userData = {
    _helper: helpers
};

export default class extends EventEmitter {
    start() {
        $(document).aa();
        return this;
    }

    render(...dataPaths) {
        let templates;

        dataPaths = dataPaths.join(' ').trim();

        if (!dataPaths || dataPaths === '*') {
            templates = regeistredTemplates.getAll();
        } else {
            templates = regeistredTemplates.getByDataPaths(dataPaths.split(/\s+/));
        }

        templates.forEach(({ $el, listenDataPaths, templateHtml }) => {
            let data = {};

            listenDataPaths.forEach(path => {
                $.extend(data, this.get(path));
            });

            $el
                .html(mustache.render(templateHtml, data))
                .addClass('_rendered');
        });

        return this;
    }

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

    get(path = null, defaults = undefined) {
        if (path) {
            return $.objectPath.get(userData, path, defaults);
        }
        return userData;
    }

    set(path, val) {
        if ($.isPlainObject(path)) {
            for (let i in path) {
                this.set(i, path[i]);
            }
        } else {
            $.objectPath.set(userData, path, val);
        }
        return this;
    }

    unset(path) {
        $.objectPath.del(userData, path);
        return this;
    }

    has(path) {
        return $.objectPath.has(userData, path);
    }

    modify(path, fn) {
        const val = this.get(path);
        this.set(path, fn(val));
        return this;
    }

    increment(path, step = 1) {
        if (this.has(path)) {
            this.modify(path, v => v + step);
        }
        return this;
    }

    decrement(path, step = 1) {
        if (this.has(path)) {
            this.modify(path, v => v - step);
        }
        return this;
    }

    rename(path, newPath) {
        this.set(newPath, this.get(path));
        this.unset(path);

        return this;
    }

    extend(path, ...values) {
        const data = this.get(path, {});
        this.set(path, $.extend(data, ...values));

        return this;
    }
}