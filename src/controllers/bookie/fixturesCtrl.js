const dbo = require('../../db/conn');

exports.fixtures = async (req, res) => {
  // console.log(fixtures)
  const collection = dbo.getDb().collection('fixtures');
  const fixtures =  collection.find();
  console.log(fixtures)
  res.status(200).json(fixtures)
}
