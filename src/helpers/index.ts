function times(start: number, end: number, block: any) {
    var ret = '';
    for (var i = start; i <= end; i++) {
        ret += block.fn(i);
    }
    return ret;
}

function eq(left: any, right: any): boolean {
    return left == right;
}

function add(i: number, k: number): number {
    return i + k;
}

export default {times, eq, add};