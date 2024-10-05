class StringBuilder {
    constructor() {
        this.strings = [];
    }

    append(str) {
        this.strings.push(str); // 배열에 문자열 추가
        return this; // 체이닝을 위해 자기 자신을 반환
    }

    toString() {
        return this.strings.join(''); // 배열을 하나의 문자열로 결합
    }
  }