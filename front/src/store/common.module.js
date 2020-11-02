export const common = {
    actions: {
        getDays(value) {
            const days = {
                Mon: { name: '월', id: 0 },
                Tue: { name: '화', id: 1 },
                Wed: { name: '수', id: 2 },
                Thu: { name: '목', id: 3 },
                Fri: { name: '금', id: 4 },
                Sat: { name: '토', id: 5 },
                Sun: { name: '알', id: 6 },
            }
            let arr = [];
            for (let day of value) {
                arr.push(days[day]);
            }

            arr.sort(function (a, b) {
                if (a.id > b.id) {
                    return 1;
                }
                if (a.id < b.id) {
                    return -1;
                }
                return 0;
            });
            let rtn = [];
            for (let day of arr) {
                rtn.push(arr[day].name);
            }
            return rtn;
        }
    },
}