export function isRelatedPath(path1, path2) {
    const [long, short] = (path1.length > path2.length) ? [path1, path2] : [path2, path1];
    return long.indexOf(short) === 0;
}

export function isRelatedPathArray(pathArr1, pathArr2) {
    return pathArr1.some(path1 => {
        return pathArr2.some(path2 => {
            return isRelatedPath(path1, path2);
        });
    });
}