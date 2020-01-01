const parts: {[part: number]: {from: number, to: number, count: number}} = {
    1: {
        from: 1,
        to: 6,
        count: 6,
    },
    2: {
        from: 7,
        to: 31,
        count: 25,
    },
    3: {
        from: 32,
        to: 70,
        count: 39,
    },
    4: {
        from: 71,
        to: 100,
        count: 30,
    },
    5: {
        from: 101,
        to: 130,
        count: 30,
    },
    6: {
        from: 131,
        to: 146,
        count: 16
    },
    7: {
        from: 147,
        to: 200,
        count: 54
    }
};

/**
 * Finds the part the given question number belongs to.
 * 
 * @param num the number of the question we want to find the part
 * @returns the part the given question number belongs to
 */
function findPartFromQuestion(num: number): number | null {

    if(num < 1 || num > 200) {
        return null;
    }

    var part = 1;
    while(part <= 7 && parts[part].to < num) {
        part++;
    }

    return part == 8 /* should never happen */ ? null : part;
}

export {parts, findPartFromQuestion};