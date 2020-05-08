require('dotenv').config();

// module.exports = {
//     url: "mongodb+srv://renansaraiva:ocr.1010@discovery-jpanz.mongodb.net/test?retryWrites=true&w=majority"
// };

module.exports = {
    url: `mongodb+srv://${process.env.BDUSER}:${process.env.DBPASSWORD}@${process.env.DBURI}`
};