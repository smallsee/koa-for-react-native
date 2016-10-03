function * GenA(next){
  console.log('from GenA, first.');
  yield next;
  console.log('from GenA, second.');
  var value3 = yield 2;
  console.log('from GenA, third.',value3);
  return 3;
}
GenA();


