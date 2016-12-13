function isContainNotations(triggers, listens) {
    return triggers.some(trigger => {
        return listens.some(listen => {
            return trigger.indexOf(listen) === 0;
        });
    });
}

class Templates {
    constructor() {
        this.registerd = [];
    }

    add($el, listenDataPaths, templateHtml) {
        this.registerd.push({ $el, listenDataPaths, templateHtml });
    }

    getByDataPaths(dataPaths = []) {
        return this.registerd
            .filter(item => {
                return isContainNotations(dataPaths, item.listenDataPaths);
            });
    }

    getAll() {
        return this.registerd.slice(0);
    }
}

export default new Templates();