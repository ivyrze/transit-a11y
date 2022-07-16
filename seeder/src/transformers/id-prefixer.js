const idPrefixer = (source, id) => {
    source['stop_id'] = id + "-" + source['stop_id'];
    return source;
}
export { idPrefixer };