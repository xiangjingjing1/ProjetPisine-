function listeningScore(correctCount: number): number {
    if(correctCount <= 6) {
        return 5;
    }

    if(correctCount <= 25) {
        return (correctCount - 5) * 5;
    }

    if(correctCount >= 90) {
        return 495;
    }

    var total = 110;
    var current = 26;
    while(correctCount > current) {

        current++;

        switch(current) {
            
            case 35:
            case 44:
            case 47:
            case 53:
            case 56:
            case 59:
            case 64:
            case 67:
            case 70:
            case 77:
            case 80:
            case 83:
                total += 10;
                break;
            default:
                total += 5;
        }

    }

    return total;
}

function readingScore(correctCount: number): number {

    if(correctCount <= 15) {
        return 5;
    }

    if(correctCount <= 24) {
        return (correctCount - 14) * 5;
    }

    if(correctCount >= 97) {
        return 495;
    }

    var total = 60;
    var current = 25;
    while(correctCount > current) {

        current++;

        switch(current) {

            case 28:
            case 33:
            case 38:
            case 41:
            case 46:
            case 49:
            case 56:
            case 61:
            case 64:
            case 67:
            case 72:
            case 77:
            case 89:
            case 92:
            case 94:
                total += 10;
                break;
            default:
                total += 5;
        }

    }

    return total;

}

export {readingScore, listeningScore};