function ready() {

  const app = new Vue({
    el: '#app',
    data: {
      fetching: false,
      from: "",
      to: "",
      orderBy: "",
      descOrder: false,
      columns: {
        SeatNumber: "رقم الجلوس",
        Name: "الاسم",
        School: "المدرسة",
        DeptName: "الادارة التعليمية",
        Section: "الشعبة",
        TotalDegree: "مجموع الدرجات",
        Percentage: "النسبة المئوية",
        StudentCase: "حالة الطالب",
        Arabic1: "اللغة العربية",
        // Arabic2: "اللغة العربية 2",
        English1: "اللغة الاجنبية الاولى 1",
        // English2: "اللغة الاجنبية الاولى 2",
        Flanguage2: "اللغة الاجنبية الثانية",
        // Math1J: "الجبر رياضيات 1",
        // Math1T: "التفاضل - رياضيات 1",
        Math1: "مجموع الرياضيات البحتة",
        History: "التاريخ",
        Geography: "الجغرافيا",
        Philosophy: "الفلسفة والمنطق",
        Psychology: "علم النفس والاجتماع",
        Economie: "الاقتصاد",
        Statistics: "الاحصاء",
        EconomieAndStatistics: "الاقتصاد والاحصاء",
        Chemistry: "الكيمياء",
        Biology: "الاحياء",
        Geology: "الجيولوجيا وعلوم البيئة",
        // Math2J: "الجبر - رياضيات",
        // Math2T: "التفاضل - رياضيا ت 2",
        // Math2M: "الميكانيكا - رياضيات 2",
        Math2: "الرياضيات 2",
        Physics: "الفيزياء",
        Religion1: "التربية الدينية",
        // Religion1: "التربية الدينية 1",
        // Religion2: "التربية الدينية 2",
        National: "التربية الوطنية",
        // ArabicHL: "لغة عربية (مستوى رفيع)",
        // EnglishHL: "لغة أولى (مستوى رفيع) :",
        // GeographyHL: "جغرافيا (مستوى رفيع)",
        // PhilosophyHL: "فلسفة (مستوى رفيع)",
        // BiologyHL: "احياء (مستوى رفيع)",
        // MathHL: "رياضيات (مستوى رفيع)",
        NoOfFails: "عدد مواد الرسوب"
        // StudentType: "طلاب",
        // OrderEgypt: "0",
        // OrderDept: "0",
        // OrderState: "0",
        // OrderSchool: "0",
        // TotalDegreeAfterHL: "مجموع الدرجات بعد المستوى الرفيع",
      },
      students: []
    },

    mounted() {
      this.students = results;
    },

    computed: {
      startDisabled() {
        let from = parseInt(this.from);
        let to = parseInt(this.to);
        return this.fetching || !from || !to || !(to > from) && to !== from;
      },
      sortedStudents() {
        if (this.orderBy) {
          this.students.sort((a, b) => {
            let f = this.descOrder ? b : a;
            let s = !this.descOrder ? b : a;
            return f[this.orderBy] - s[this.orderBy];
          });
        }
        return this.students;
      }
    },

    methods: {
      getText(column, student) {
        let text = student[column];

        switch (column) {
          case "Percentage":
            text = student.TotalDegree / 410 * 100;
            text = (text + "").substr(0, 5) + "%";
            break;
          case "StudentCase":
            text = this.case(text);
            break;
          case "Section":
            text = this.branch(text);
            break;
          // case "SeatNumber":
          // case "Name":
          //   text = "*************";
          //   break;
          default:
            text = this.subjectsCases(text);
            break;
        }

        return text;
      },

      branch(e) {
        return "0" === e ? "غير محدد" : "1" === e ? "الشعبة العلمية - علوم" : "2" === e ? "الشعبة العلمية - رياضيات" : "5" === e ? "الشعبة الأدبية" : e;
      },

      subjectsCases(e) {
        return "-1" === e ? "غائب" : "-2" === e ? "معفى" : "-3" === e ? "ملغي" : "-4" === e ? "غير مقرر" : "-6" === e ? "مؤجل" : e;
      },

      case(c) {
        c = parseInt(c);
        return c === 1 || c === 5 ? 'ناجح' : c === 2 ? 'دور ثان' : c === 3 || c === 6 ? 'راسب' : c === 12 ? 'غياب كلى' : c;
      },

      sort(column) {
        if (column === "Percentage") column = "TotalDegree";
        this.descOrder = this.orderBy === column ? !this.descOrder : true;
        this.orderBy = column;
      }

    }

  });
}

document.addEventListener('DOMContentLoaded', ready);