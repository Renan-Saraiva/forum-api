require('dotenv').config();

module.exports = {
    url: `mongodb+srv://${process.env.BDUSER}:${process.env.DBPASSWORD}@${process.env.DBURI}`
};
