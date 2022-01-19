/* eslint-disable eqeqeq */
const fs = require('fs');
const path = require('path');

const f = path.resolve(__dirname, 'employees.json');

const data = fs.readFileSync(f);
let { employees } = JSON.parse(data);

const getEmployees = () => employees;
const deleteEmployee = (id) => {
  employees = employees.filter((e) => e.id != id);
};

module.exports = { getEmployees, deleteEmployee };
