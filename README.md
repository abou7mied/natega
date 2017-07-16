# Fetch Natega of Thanawya and sort results

## Usage
Clone this repo then install dependencies
```bash
npm install --production
```
Use **fetch.js** command and pass seatNumber and count, for example
```bash
./fetch.js -s 1234 -c 10
```
This will fetch results for seat numbers from 1234 to 1243, results will be saved at **dist/results.js** as global variable with name **results**

**Azhar Example:**
```bash
./fetch.js -s 1234 -c 10 -p azhar2
```

**All options:**
```
  Usage: fetch [options]


  Options:

    -V, --version                   output the version number
    -s, --seatNumber <number>       seat Number
    -c, --count <count>             count of students to fetch results
    -p, --profile <profile>         which results to fetch? General (Thanawy 3am, default), Azhar(TotalDegree only) or Azhar2(Subjects degrees)
    -r, --clearPrefetched           clear prefetched and save new only
    -w, --writeFetchedEveryRequest  write fetched data after each request
    --maxSockets <number>           max parallel sockets used to fetch data
    -h, --help                      output usage information

```

Open **index.html** in the browser

##

## Screenshot of results
![](screenshot.png) 

## Features
- Sort by subject or total degree (click on column to sort)
- Thanawy 3am and Azhar
- Skip prefetched and combine with new results
- Filter displayed results

## Modify App.js
If you want to modify app.js you should install devDependencies and run **build** after the modifing
```bash
npm install ## install devDependencies
npm run build
```

## Share results
All you need is **index.html** and **dist** directory
