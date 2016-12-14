function isContatinEachOther(triggers, listens) {
    return triggers.some(trigger => {
        return listens.some(listen => {
            const [long, short] = trigger.length > listen.length ? [trigger, listen] : [listen, trigger];
            return long.indexOf(short) === 0;
        });
    });
}

class Templates {
    constructor() {
        this.registerd = [];
    }

    add($el, listenDataPaths, template) {
        this.registerd.push({ $el, listenDataPaths, template });
    }

    getByDataPaths(dataPaths = []) {
        return this.registerd
            .filter(item => {
                return isContatinEachOther(dataPaths, item.listenDataPaths);
            });
    }

    getAll() {
        return this.registerd.slice(0);
    }
}

export default new Templates();