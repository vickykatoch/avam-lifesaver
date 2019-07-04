import { uniqBy, prop, sortBy } from "ramda";
// import remove from "lodash-es";

const mutateRemove = (arr: any[], comparer: any): any[] => {
  const delItems = arr.filter(comparer);
  delItems.forEach(item => {
    arr.splice(arr.indexOf(item), 1);
  });
  return delItems;
};

const genArray = (n: number): any[] => {
  const arrays = [];
  for (let i = 0; i < n; i++) {
    arrays.push({
      name: "NAME" + Math.floor(Math.random() * n),
      value: Math.floor(Math.random() * n)
    });
  }
  return arrays;
};
const values = genArray(1e5);
console.time("Filter");
const items = values.filter(item => item.value > 5);
console.timeEnd("Filter");

// console.time("RFilter");
// const ritems = remove(values, item => item.value > 5);
// console.log("Lodash Removed : ", ritems.length);
// console.timeEnd("RFilter");

console.time("Mutate");
const delItems = mutateRemove(values, item => item.value > 5);
console.log("Deleted : ", delItems.length);
console.log("Remaining : ", values.length);

console.timeEnd("Mutate");

// console.log(values);
// console.log("Deleted", delItems);
// console.log("remaining", values);
// const emps = [
//   { name: "BK", dept: "IT" },
//   { name: "SK", dept: "IT" },
//   { name: "DK", dept: "HR" },
//   { name: "GK", dept: "FN" }
// ];
// const getProp = prop("dept");
// const data = sortBy(getProp, uniqBy(getProp, emps || []));
// console.log(data);
