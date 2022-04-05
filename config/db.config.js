module.exports = {
  HOST: "localhost",
  USER: "postgres",
  PASSWORD: "1234", // update the db password here
  DB: "books_db", //add database name here
  dialect: "postgres",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
