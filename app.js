function ready() {

  const app = new Vue({
    el: '#app',
    data: {
      profile: "general",
      totalDegree: {
        key: "TotalDegree",
        value: 410,
      },
      fetching: false,
      from: "",
      to: "",
      orderBy: "",
      descOrder: false,
      filterBy: "",
      filterKey: "",
      columns: {},
      students: [],
      selected: [],
    },

    mounted() {
      this.students = results.students;

      // this.students = results.students;
      this.columns = results.columns;
      this.profile = results.profile;
      this.totalDegree = results.totalDegree;
    },

    computed: {
      startDisabled() {
        let from = parseInt(this.from);
        let to = parseInt(this.to);
        return this.fetching || !from || !to || (!(to > from) && to !== from);
      },
      sortedStudents() {
        let results = Object.keys(this.students).map((key) => {
          return this.students[key];
        });

        if (this.filterBy && this.filterKey) {
          results = results.filter((item) => {
            return item[this.filterBy].indexOf(this.filterKey) !== -1;
          })
        }

        if (this.orderBy) {
          results = results.sort((a, b) => {
            // 'a'.localeCompare('c');
            let f = this.descOrder ? b : a;
            let s = !this.descOrder ? b : a;
            const fVal = f[this.orderBy];
            const sVal = s[this.orderBy];
            // if (typeof fVal === "string") {
            // return fVal.localeCompare(sVal);
            return fVal.localeCompare(sVal);
            // }
            // return fVal - sVal;
          });
        }
        return results;
      }
    },

    methods: {
      getText(column, student) {
        let text = student[column];

        switch (column) {
          case "Percentage":
            text = ((student[this.totalDegree.key] / this.totalDegree.value) * 100);
            text = (text + "").substr(0, 5) + "%";
            break;
          case "StudentCase":
            text = this.case(text);
            break;
          case "Section":
            text = this.branch(text);
            break;
          default:
            text = this.subjectsCases(text);
            break;
        }

        return text;
      },


      branch(e) {
        return "0" === e ? "غير محدد" : "1" === e ? "الشعبة العلمية - علوم" : "2" === e ? "الشعبة العلمية - رياضيات" : "5" === e ? "الشعبة الأدبية" : e
      },


      subjectsCases(e) {
        return "-1" === e ? "غائب" : "-2" === e ? "معفى" : "-3" === e ? "ملغي" : "-4" === e ? "غير مقرر" : "-6" === e ? "مؤجل" : e
      },

      case(c) {
        c = parseInt(c);
        return (c === 1 || c === 5 ? 'ناجح' : (c === 2 ? 'دور ثان' : (c === 3 || c === 6 ? 'راسب' : (c === 12 ? 'غياب كلى' : c))))
      },


      sort(column) {
        if (column === "Percentage")
          column = this.totalDegree.key;
        this.descOrder = this.orderBy === column ? !this.descOrder : true;
        this.orderBy = column;
      },
      clearFilter() {
        this.filterKey = "";
      },
      itemClick(seatNumber) {
        seatNumber = parseInt(seatNumber);
        const index = this.selected.indexOf(seatNumber);
        if (index === -1) {
          this.selected.push(seatNumber);
        } else {
          this.selected.splice(index, 1);
        }
      },
      isSelected(student) {
        return this.selected.indexOf(student.SeatNumber || student.StSeatNo) !== -1
      }
    }

  });


}


document.addEventListener('DOMContentLoaded', ready);

