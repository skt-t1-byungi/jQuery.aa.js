import { isRelatedPathArray } from '../util';

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
                return isRelatedPathArray(dataPaths, item.listenDataPaths);
            });
    }

    getAll() {
        return this.registerd.slice(0);
    }
}

export default new Templates();