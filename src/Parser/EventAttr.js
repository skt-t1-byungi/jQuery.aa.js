const EVENT_EXPANDO = '_$EVENT_' + Date.now();

export default class {
    constructor($el, expr, emitter) {
        this.$el = $el;
        this.emitter = emitter;
        this.parsed = this.parse(expr);
        // this.$event = null;
    }

    parse(expr) {
        return this
            .extractNames(expr)
            .map(name => {
                const regex = new RegExp(`^\s*${name}(\([^)]*\))?\s*,?`);
                const matched = expr.match(regex);

                let params = [];

                //param 존재할경
                if (matched.length > 1) {
                    params = matched[1]
                        .slice(1, -1) //괄호제거
                        .split(',')
                        .map(param => {
                            param = param.trim();

                            if (param === '$el') {
                                return this.$el;
                            }

                            if (param === '$event') {
                                return EVENT_EXPANDO;
                            }

                            return eval(param);
                        });
                }

                expr.replace(regex, ''); // 순서대로 parsing 끝난 요소 제거

                return { name, params };
            });
    }

    extractNames(expr) {
        return expr.replace(/\([^)]*\)/g, '') //괄호제거제거
            .split(',')
            .map(str => str.trim());
    }

    trigger(event) {
        this.parsed.forEach(item => {
            let params = item.params.map(param => param === EVENT_EXPANDO ? event : param);
            this.emitter.trigger(item.name, params);
        });
    }
}