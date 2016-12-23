const _listenHandlers = {};

function isRelatedPathExpr(expr, path) {
    //하위 표시자 존재할 경우.
    const matches = expr.match(/(.*?)\.\*$/);
    if (matches) {
        expr = matches[1];
        return path.indexOf(expr) === 0;
    } else {
        return expr === path;
    }
}

export function dispatch(path, type, ...params) {
    const handlers = [];

    //pick
    for (let listenPathExpr in _listenHandlers) {

        if (!isRelatedPathExpr(listenPathExpr, path)) {
            continue;
        }

        for (let item of _listenHandlers[listenPathExpr]) {
            if (item.type === '*' || item.type === type) {
                handlers.push(item.handler);
            }
        }
    }

    //trigger
    for (let handler of handlers) {
        handler(...params);
    }
}

export function listenTo(pathExpr, type, handler) {
    if (_listenHandlers[pathExpr] === undefined) {
        _listenHandlers[pathExpr] = [];
    }

    _listenHandlers[pathExpr].push({
        handler,
        type: type || '*'
    });

}