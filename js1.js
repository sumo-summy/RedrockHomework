let student = {
  name: 'Billy',
  age: 21,
  gender: 'male'
};
let copies = []; 
for (let i = 0; i < 3; i++) {
  let copy = { ...student };
  copies.push(copy);
}
console.table(copies);
