/**
 * param a is compared against param b.
 * @param {any[]} a
 * @param {any[]} b
 * @returns {boolean}
 */
export const equalArray = (a: any[], b: any[]): boolean => {
    let newA = a.sort();
    let newB = b.sort();
    newA = newA.map((v) => (Object.prototype.toString.call(v) === "[object Date]") ? v.getTime() : v);
    newB = newB.map((v) => (Object.prototype.toString.call(v) === "[object Date]") ? v.getTime() : v);
    let equal = true;
    for (let i = 0; i < newA.length; i++) {
        equal = equal && (newA[i] === newB[i]);
    }
    return equal;
};
