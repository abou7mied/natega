"use strict";

function ready() {

  var app = new Vue({
    el: '#app',
    data: {
      profile: "general",
      totalDegree: {
        key: "TotalDegree",
        value: 410
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
      selected: []
    },

    mounted: function mounted() {
      this.students = results.students;

      // this.students = results.students;
      this.columns = results.columns;
      this.profile = results.profile;
      this.totalDegree = results.totalDegree;
    },


    computed: {
      startDisabled: function startDisabled() {
        var from = parseInt(this.from);
        var to = parseInt(this.to);
        return this.fetching || !from || !to || !(to > from) && to !== from;
      },
      sortedStudents: function sortedStudents() {
        var _this = this;

        var results = Object.keys(this.students).map(function (key) {
          return _this.students[key];
        });

        if (this.filterBy && this.filterKey) {
          results = results.filter(function (item) {
            return item[_this.filterBy].indexOf(_this.filterKey) !== -1;
          });
        }

        if (this.orderBy) {
          results = results.sort(function (a, b) {
            // 'a'.localeCompare('c');
            var f = _this.descOrder ? b : a;
            var s = !_this.descOrder ? b : a;
            var fVal = f[_this.orderBy];
            var sVal = s[_this.orderBy];
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
      getText: function getText(column, student) {
        var text = student[column];

        switch (column) {
          case "Percentage":
            text = student[this.totalDegree.key] / this.totalDegree.value * 100;
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
      branch: function branch(e) {
        return "0" === e ? "غير محدد" : "1" === e ? "الشعبة العلمية - علوم" : "2" === e ? "الشعبة العلمية - رياضيات" : "5" === e ? "الشعبة الأدبية" : e;
      },
      subjectsCases: function subjectsCases(e) {
        return "-1" === e ? "غائب" : "-2" === e ? "معفى" : "-3" === e ? "ملغي" : "-4" === e ? "غير مقرر" : "-6" === e ? "مؤجل" : e;
      },
      case: function _case(c) {
        c = parseInt(c);
        return c === 1 || c === 5 ? 'ناجح' : c === 2 ? 'دور ثان' : c === 3 || c === 6 ? 'راسب' : c === 12 ? 'غياب كلى' : c;
      },
      sort: function sort(column) {
        if (column === "Percentage") column = this.totalDegree.key;
        this.descOrder = this.orderBy === column ? !this.descOrder : true;
        this.orderBy = column;
      },
      clearFilter: function clearFilter() {
        this.filterKey = "";
      },
      itemClick: function itemClick(seatNumber) {
        seatNumber = parseInt(seatNumber);
        var index = this.selected.indexOf(seatNumber);
        if (index === -1) {
          this.selected.push(seatNumber);
        } else {
          this.selected.splice(index, 1);
        }
      },
      isSelected: function isSelected(student) {
        return this.selected.indexOf(student.SeatNumber || student.StSeatNo) !== -1;
      }
    }

  });
}

document.addEventListener('DOMContentLoaded', ready);
//# sourceMappingURL=app.js.map