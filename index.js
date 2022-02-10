const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

let output = [];

function writeFile(data) {
  fs.writeFile("output.json", JSON.stringify(data), "utf8", function (err) {
    if (err) {
      console.log("An error occured while writing JSON Object to File.");
      return console.log(err);
    }
    console.log("JSON file has been saved.");
  });
}

axios
  .get("https://www.tomshardware.com/reviews/gpu-hierarchy,4388.html")
  .then((response) => {
    return cheerio.load(response.data);
  })
  .then(($) => {
    $(".articletable tbody tr").each(function () {
      let tds = $(this).children();
      output.push({
        name: $(tds[0]).text(),
        score: Number($(tds[1]).text().slice(0, -1)),
        gpu: $(tds[2]).text(),
        base_boost: $(tds[3]).text(),
        memory: $(tds[4]).text(),
        power: $(tds[5]).text(),
      });
    });
    return output.filter((e) => e.score !== "");
  })
  .then((json) => writeFile(json))
  .catch((error) => console.log(error));
