import { isRelatedPath } from 'util';

const _listenHandlers = {};


export function dispatch(path, type, ...params) {
    const handlers = [];

    //pick
    for (let listenPath in _listenHandlers) {
        if (!isRelatedPath(path, listenPath)) {
            continue;
        }

        for (let item of _listenHandlers[listenPath]) {
            if (item.type === 'all' || item.type === type) {
                handlers.push(item.handler);
            }
        }
    }

    //trigger
    for (let handler of handlers) {
        handler(...params);
    }
}

export function listenTo(path, type, handler) {
    if (_listenHandlers[path] === undefined) {
        _listenHandlers[path] = [];
    }

    _listenHandlers[path].push({
        handler,
        type: type || 'all'
    });

}