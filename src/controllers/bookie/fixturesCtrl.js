// const db = require('../../models/mongodb'); 
// const collection = db.collection('fixtures');
// const fixtures = require('../../sportmonks/1 Fixtures/Fixtures by Date Range.json');
// console.log(fixtures)

const dbo = require('../../db/conn');

exports.fixtures = async (req, res) => {
  // console.log(fixtures)
  const collection = dbo.getDb().collection('fixtures');
  const fixtures =  collection.find();
  console.log(fixtures)
  res.status(200).json(fixtures)
}
