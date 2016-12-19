const REGEX_EVENT_EXPR = /^\s*([^, (]+)(\(.*?\))?/;
const REGEX_EVENT_EXPR_WITH_DELIMITER = /^\s*[^, (]+(\(.*?\))?\s*,?\s*/;

export default class {
    constructor($el, expr) {
        this.$el = $el;
        this.expr = expr.trim();
    }

    parse(event) {
        let expr = this.expr;
        const parsed = [];

        do {
            const [, name, paramsExpr] = expr.match(REGEX_EVENT_EXPR);

            parsed.push({
                name,
                params: this.parseParams(event, paramsExpr)
            });

            expr = expr.replace(REGEX_EVENT_EXPR_WITH_DELIMITER, '');
        } while (expr !== '');

        return parsed;
    }

    parseParams(event, paramsExpr = '()') {
        paramsExpr = paramsExpr
            .slice(1, -1) //괄호제거;
            .replace(/\$event/g, 'event')
            .replace(/\$el/g, 'this.$el');

        return eval(`[${paramsExpr}]`);
    }

}