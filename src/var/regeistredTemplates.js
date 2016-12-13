class Templates {
    constructor() {
        this.registerd = [];
    }

    add($el, listenDataPaths, templateHtml) {
        this.registerd.push({ $el, listenDataPaths, templateHtml });
    }

    getByDataPath(...dataPaths) {
        const arr = [];

        dataPaths.forEach(path => {
            this.registerd
                .forEach(item => {
                    item.listenDataPaths.forEach(listenDataPath => {
                        if (
                            path.indexOf(listenDataPath) === 0 &&
                            arr.indexOf(item) === -1
                        ) {
                            arr.push(item);
                            return;
                        }
                    });
                });
        });

        return arr;
    }

    getAll() {
        return this.registerd.slice(0);
    }
}

export default new Templates();