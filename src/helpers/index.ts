function times(n: number, block: any) {
    var ret = '';
    for (var i = 0; i < n; i++) {
        ret += block.fn(i);
    }
    return ret;
}

export default {times};