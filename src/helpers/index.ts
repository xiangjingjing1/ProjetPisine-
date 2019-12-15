function times(start: number, end: number, block: any) {
    var ret = '';
    for (var i = start; i <= end; i++) {
        ret += block.fn(i);
    }
    return ret;
}

export default {times};