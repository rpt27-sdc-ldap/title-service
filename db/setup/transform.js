const transform = (obj) => {
  // console.log(obj);
  obj['categories'] = [];
  obj.categories.push(obj.category1);
  obj.categories.push(obj.category2);
  delete obj.category1;
  delete obj.category2;
  console.log(obj);

  return JSON.stringify(obj);
};

module.exports = transform;