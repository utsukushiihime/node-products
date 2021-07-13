const fs = require("fs");
const http = require("http");
const url = require("url");

const replaceTemplate = require("./modules/replaceTemplate");

////////////////////////////////////////////////////////////////////
// FILES

// const textIn = fs.readFileSync("./txt/input.txt", "utf8");

/*  synchronous - blocking */
// const textOut = `This is what we know about the avocado: ${textIn} \n Created On: ${Date.now()}`;
// fs.writeFileSync("./txt/output.txt", textOut, "utf8");

/* asynchronous - non-blocking - Callback Hell */
// fs.readFile("./txt/start.txt", "utf8", (err, data1) => {
//     if (err) {
//         console.log(`There is an error 🤯: ${err}`);
//     } else {
//         fs.readFile(`./txt/${data1}.txt`, "utf8", (err, data2) => {
//             console.log(data2);
//             fs.readFile(`./txt/append.txt`, "utf8", (err, data3) => {
//                 console.log(data3);
//                 fs.writeFile(
//                     "./txt/output.txt",
//                     `${data2}\n${data3}`,
//                     "utf8",
//                     (err) => {
//                         console.log("files written!");
//                     }
//                 );
//             });
//         });
//     }
// });

// console.log("Reading the file in the background...");

////////////////////////////////////////////////////////////////////
// SERVER

// ANCHOR this is important info : it's okay to call synchronously since it's outside the callback function and in top-level code
const tempOverview = fs.readFileSync(
    `${__dirname}/templates/template-overview.html`,
    "utf8"
);
const tempCard = fs.readFileSync(
    `${__dirname}/templates/template-card.html`,
    "utf8"
);
const tempProduct = fs.readFileSync(
    `${__dirname}/templates/template-product.html`,
    "utf8"
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf8");
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
    const { query, pathname } = url.parse(req.url, true);

    // Overview Page
    if (pathname === "/overview" || pathname === "/") {
        // must send headers before calling res.end() (RESPONSE)
        res.writeHead(200, { "Content-Type": "text/html" });

        const cardsHTML = dataObj
            .map((el) => replaceTemplate(tempCard, el))
            .join("");

        const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHTML);
        // console.log(cardsHTML);

        res.end(output);

        // Product Page
    } else if (pathname === "/product") {
        const product = dataObj[query.id];
        const output = replaceTemplate(tempProduct, product);

        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(output);

        // API Page
    } else if (pathname === "/api") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(data);

        // 404 Page
    } else {
        res.writeHead(404, { "Content-Type": "text/html" });
        res.end(`<h1>404 - Page not found.</h1>`);
    }
});

server.listen(8000, "127.0.0.1", () => {
    console.log("Server is listening on port 8000!");
});
