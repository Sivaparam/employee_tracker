//packages
const fs = require('fs');
const inquirer = require('inquirer');

//import class and prompts
const {Department, depPrompts} = require('./lib/department');
const {Employee,empPrompts} = require('./lib/employee');
const {Role, rolePrompts} = require('./lib/role');


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
function addEmployee() {

};

//updates role of employee  to employee table
function updateEmpRole(){

};

//retrieves all role details from role table
function getRoles() {

};

//adds a new role to role table
function addRole() {

};

//adds a new department to department table
function addDepartment() {

};

//retrieves all department from department table
function getDepartment() {

};