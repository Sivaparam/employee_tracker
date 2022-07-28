//packages
const fs = require('fs');
const inquirer = require('inquirer');
const mysql = require('mysql2');
const ctable = require('console.table');

//import class and prompts
const { Department, depPrompts } = require('./lib/department');
const { Employee, empPrompts } = require('./lib/employee');
const { Role, rolePrompts } = require('./lib/role');
const Connection = require('mysql2/typings/mysql/lib/Connection');

const Connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'employee_db'
});

//Inquirer for options
const options = [
    {
        type: 'rawlist',
        name: 'option_selected',
        message: 'What would you like to do?',
        choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department', 'Quit'],
    },
];

//displayoption function is self initiated function that display options for user to select
displayoptions();

// Function that display options for user to select. Based on option selected invokes corresponding function. 
async function displayoptions() {
    console.log('Welcome to Employee Tracker');

    await inquirer.prompt(options)
        .then(data => {
            switch (data.option_selected) {
                case "View All Employees":
                    getEmployeeData();
                    break;
                case "Add Employee":
                    addEmployee();
                    break;
                case "Update Employee Role":
                    updateEmpRole();
                    break;
                case "View All Roles":
                    getRoles();
                    break;
                case "Add Role":
                    addRole();
                    break;
                case "View All Departments":
                    getDepartment();
                    break;
                case "Add Department":
                    addDepartment();
                    break;
                case "Quit":
                    break;
            }
        })
        .catch(error => {
            console.log(`Error occurred in options: ${error}`);
        })
};

//retrieves all employee details from employee table
function getEmployeeData() {

};

//adds a new employee to employee table
async function addEmployee() {
    await inquirer.prompt(empPrompts)
        .then(data => {
            const employee = new Employee(data.firstName, data.lastName);
            const sql = employee.addEmployee();
            Connection.createQuery(sql, [data.firstName, data.lastName], (err, result) => {
                err ? console.log(err) : console.log(`Added ${data.firstName} ${data.lastName} to employee table`)
            })
        })
        .catch(error => {
            console.log(`Error occurred in add Employee ${error}`);
        })
};

//updates role of employee  to employee table
function updateEmpRole() {

};

//retrieves all role details from role table
function getRoles() {

};

//adds a new role to role table
async function addRole() {
    await inquirer.prompt(rolePrompts)
        .then(data => {
            
            const role = new Role(data.title, data.salary);
            const sql = role.addRole();
            Connection.createQuery(sql, [data.title, data.salary], (err, result) => {
                err ? console.log(err) : console.log(`Added ${data.title} to Role table`);
            })
        })
        .catch(error => {
            console.log(`Error occurred during add role ${error}`);
        })
};

//adds a new department to department table
async function addDepartment() {
    await inquirer.prompt(depPrompts)
        .then(data => {
            const department = new Department(data.depName);
            //  var departmentData = department.addDepartment();
            // fs.appendFile(depFile, departmentData, (err) => 
            //err? console.log(err): console.log('Data added to Departmemt Table'));
            const sql = department.addDepartment();
            Connection.createQuery(sql, data.depName, (err, result) => {
                err ? console.log(err) : console.log(`Added ${data.depName} to department table`);
            })
        })
        .catch(error => {
            console.log(`Error occurred during add department ${error}`);
        })
};

//retrieves all department from department table
function getDepartment() {

};