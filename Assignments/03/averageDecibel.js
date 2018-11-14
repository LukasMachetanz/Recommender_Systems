const fs = require("fs");
const csv = require("fast-csv");

let stream = fs.createReadStream("data/audio.csv");

let avgDecibel = 0;

let csvStream = csv()
    .on("data", function(data){
        //console.log(data);
        avgDecibel = data[4];
    })
    .on("end", function(){
        console.log(`Durchschnittliche Lautstärke: ${avgDecibel}`);
    });

stream.pipe(csvStream);