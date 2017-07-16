#!/usr/bin/env node

const request = require("request");
const async = require("async");
const fs = require("fs");
const program = require('commander');

const resultsFilePath = "dist/results.js";
const resultsPrefix = "var results = ";

let profiles = {
  general: {
    name: "general",
    url: "http://natega.youm7.com/Home/GetResultStage1/",
    reqSeatKey: "SeatNumber",
    timeout: 5000,
    maxAttempts: 10,
    totalDegree: {
      key: "TotalDegree",
      value: 410,
    },
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
      English1: "اللغة الاجنبية الاولى 1",
      Flanguage2: "اللغة الاجنبية الثانية",
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
      Math2: "الرياضيات 2",
      Physics: "الفيزياء",
      Religion1: "التربية الدينية",
      National: "التربية الوطنية",
      NoOfFails: "عدد مواد الرسوب",
      OrderEgypt: "ترتيب الجمهورية",
      OrderDept: "ترتيب الادارة",
      OrderState: "ترتيب المحافظة",
      OrderSchool: "ترتيب المدرسة",
    },
    dataParser(data) {
      let json = jsonParser(data);
      if (json)
        return json[0];
    }
  },
  azhar: {
    name: "azhar",
    url: "http://www.azhar.eg/DesktopModules/NatigaSecWebService/WebService1.asmx/GetResult",
    reqSeatKey: "ItemId",
    timeout: 5000,
    maxAttempts: 30,
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'Origin': "http://www.azhar.eg",
      "Referer": "http://www.azhar.eg/splash.html",
    },
    totalDegree: {
      key: "Sum",
      value: 650,
    },
    columns: {
      StSeatNo: "رقم الجلوس",
      Name: "الاسم",
      Zone: "المحافظة",
      Institute: "المعهد",
      Sum: "المجموع",
      Percentage: "النسبة المئوية",
      Result: "النتيجة",
      Dep: "القسم"
    },
    dataParser(data) {
      let json = jsonParser(data);
      if (json)
        return json.d;
    }
  },
  azhar2: {
    name: "azhar2",
    url: "http://41.128.217.236:10082/main1/sazh",
    reqSeatKey: "sn",
    timeout: 5000,
    maxAttempts: 30,
    totalDegree: {
      key: "Sum",
      value: 650,
    },
    columns: {
      StSeatNo: "رقم الجلوس",
      StudenName: 'الاسم',
      DevisionName: 'القسم',
      ZonName: 'المحافظة',
      InstituteName: 'المعهد',
      Sum: 'المجموع',
      Percentage: 'النسبة المئوية',
      QTahriri: 'قرآن تحريري',
      QShafawy: 'قرآن شفوي',
      TQuran: 'مجموع القرآن',
      Fekh: 'فقه',
      Tfseer: 'تفسير',
      Hadith: 'حديث',
      Tawhed: 'توحيد',
      HadithShafawy: 'حديث شفوي',
      Nahw: 'نحو',
      Sarf: 'صرف',
      Insha: "إنشاء",
      Balagha: 'بﻻغة',
      Adab: 'أدب',
      Logha: 'لغة أجنبية',
      LoghaS: "لغة أجنبية ثانية",
      Ghorafia: "جغرافيا",
      Tareekh: "تاريخ",
      Mantek: "منطق",
      ektsad: "إقتصاد",
      computer: "حاسب آلي",
      Gabr: 'جبر',
      Tafadol: 'تفاضل',
      Mekanika: 'ميكانيكا',
      Phezia: 'فيزياء',
      Kemia: 'كيمياء',
      Ahia: 'أحياء',
      Mostawa: "المستوى",
      Result: 'النتيجة',
      QKafeef: "قرآن كفيف",
      Kraat: "قراءات",
    },
    dataParser(data) {
      let json = jsonParser(data);
      if (json)
        return json[0];
    }
  }
};

let profile = profiles.general;
let fetched = 0;

function jsonParser(text) {
  let json;
  if (typeof text === "string")
    try {
      json = JSON.parse(text);
    } catch (e) {
      console.log("error while parsing");
    }
  else json = text;
  return json;
}


program
  .version('0.3.0')
  .option('-s, --seatNumber <number>', 'seat Number', parseInt)
  .option('-c, --count <count>', 'count of students to fetch results', parseInt)
  .option('-p, --profile <profile>', 'which results to fetch? General (Thanawy 3am, default), Azhar(TotalDegree only) or Azhar2(Subjects degrees)')
  .option('-r, --clearPrefetched', 'clear prefetched and save new only')
  .option('-w, --writeFetchedEveryRequest', 'write fetched data after each request')
  .option('--maxSockets <number>', 'max parallel sockets used to fetch data', parseInt)
  .parse(process.argv);

let results = {
  students: {},
  notFetched: [],
};

function fetchStudent(seatNumber, next, attemptNo) {
  request.post(profile.url, {
    body: {
      [profile.reqSeatKey]: seatNumber
    },
    json: true,
    timeout: profile.timeout,
    headers: profile.headers,
  }, (err, response, body) => {

    attemptNo = typeof attemptNo === "undefined" ? 0 : attemptNo;

    if (err) {
      let nextAttempt = attemptNo + 1;
      if (nextAttempt > profile.maxAttempts) {
        console.log("Error after %d attempts, seatNumber: %d", attemptNo, seatNumber);
        results.notFetched.push(seatNumber);
        next();
      } else {
        console.log("Error while fetching: %d, attempt NO: %d", seatNumber, attemptNo);
        fetchStudent(seatNumber, next, !attemptNo ? 1 : nextAttempt);
      }
      return;
    }

    let parsed = profile.dataParser(body);

    if (parsed) {
      results.students[seatNumber] = parsed;
      console.log("Fetched: %d, seatNumber: %d, Name: %s", ++fetched, seatNumber, (parsed.Name || parsed.StudenName));
    } else {
      console.log("No Results for %d", seatNumber);
    }

    if (program.writeFetchedEveryRequest) {
      writeFetched(next);
    } else {
      next();
    }

  });
}

function fetch() {

  async.waterfall([
    (next) => {
      fs.readFile(resultsFilePath, "utf8", (err, data) => {
        if (err) {
          console.log("Error loading old results");
        } else {
          try {
            let parsed = JSON.parse(data.replace(resultsPrefix, ""));
            let noSameProfile = parsed.profile === profile.name;
            let clearPrefetched = program.clearPrefetched;
            if (noSameProfile || clearPrefetched) {
              console.log("Backup prefetched");
              fs.rename(resultsFilePath, `dist/${parsed.profile}-${Date.now()}.js`, next);
              return;
            } else {
              if (parsed.students)
                results.students = parsed.students;
              if (parsed.notFetched)
                results.notFetched = parsed.notFetched;
            }
          } catch (e) {
            console.log("Error parsing old results");
          }
        }
        next();
      });
    },
  ], () => {
    results.columns = profile.columns;
    results.totalDegree = profile.totalDegree;
    results.profile = profile.name;

    let from = program.seatNumber;
    let count = program.count;

    console.log("Total Count: %d", count);

    async.timesLimit(count, program.maxSockets || 30, (n, next) => {
      let seatNumber = from + n;
      if (!results.students[seatNumber]) {
        fetchStudent(seatNumber, next);
      } else {
        console.log("Skip prefetched seatNumber: %d", seatNumber);
        next();
      }
    }, () => {
      writeFetched();
      if (results.notFetched.length)
        console.log("Seat Numbers couldn't be fetched: %s", JSON.stringify(results.notFetched));
      console.log("Done!");
    });
  });
}

function writeFetched(cb) {
  let data = `${resultsPrefix}${JSON.stringify(results)}`;
  fs.writeFile(resultsFilePath, data, 'utf8', function () {
    if (cb)
      cb();
  });
}

if (program.profile) {
  program.profile = program.profile.toLowerCase();
  console.log("program.profile", program.profile);
  if (profiles[program.profile]) {
    profile = profiles[program.profile];
  }
}

if (program.seatNumber && program.count) {
  fetch();
} else {
  console.log("Please pass seatNumber and count arguments");
}

process.on('SIGINT', () => {
  console.log("SIGTERM, write fetched to file");
  writeFetched(() => {
    process.exit();
  });
});
