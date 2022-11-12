export const recapitalize = (source, options, target) => {
    source[target] = source[target].replace(/[\w']*\b/g, word => {
        return !/^(([NESWOI]BD?)|[NS][EW]|[NF]S|P&R)$/i.test(word) ?
            word.charAt(0).toUpperCase() + word.substr(1).toLowerCase() :
            word.toUpperCase();
    });
    return source;
};