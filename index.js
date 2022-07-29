require('dotenv').config();

//Inquirer package
const inquirer = require('inquirer');
//import and require mysql
const mysql = require('mysql2');
//const ctable = require('console.table');

const { exit } = require('process');

// //import class and prompts
// const { Department, depPrompts } = require('./lib/department');
// const { Employee, empPrompts } = require('./lib/employee');
// const { Role, rolePrompts } = require('./lib/role');

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: process.env.MYSQLPASSWORD,
        database: 'employee_db'
    });

//Inquirer for options
const options = [
    {
        type: 'rawlist',
        name: 'optionSelected',
        message: 'What would you like to do?',
        choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department', 'Quit'],
    },
];

//displayoption function is self initiated function that display options for user to select
displayoptions();

// Function that display options for user to select. Based on option selected invokes corresponding function. 
async function displayoptions() {
    await inquirer.prompt(options)
        .then(data => {
            switch (data.optionSelected) {
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
                    process.exit();
            }
        })
        .catch(error => {
            console.log(`Error occurred in options: ${error}`);
        })
};

//retrieves all employee details from employee table
async function getEmployeeData() {
    const employeeData = await getEmployeeList();
    console.table(employeeData);
    displayoptions();
};

//adds a new employee to employee table
async function addEmployee() {

    const roleList = await getRoleList();
    var roles = [];
    roleList.forEach(element => {
        roles.push(element.title);
    });

    const mangerList = await getEmployeeList();
    var managers = [];
    mangerList.forEach(element => {
        managers.push(element.first_name.concat(" ", element.last_name));
    });

    // inquirer for add employee
    const empPrompts = [
        {
            type: 'input',
            name: 'firstname',
            message: 'Enter Employee First Name:',
        },
        {
            type: 'input',
            name: 'lastname',
            message: 'Enter Employee Last Name:',
        },
        {
            type: 'rawlist',
            name: 'emprole',
            message: 'Enter Employee role:',
            choices: roles,
        },
        {
            type: 'rawlist',
            name: 'manager',
            message: 'Who is employee manager:',
            choices: managers,
        },
    ];
    await inquirer.prompt(empPrompts)
        .then(data => {

            console.log(data.firstname);
            console.log(data.lastname);
            console.log(data.emprole);
            console.log(data.manager);

            roleList.forEach(element => {
                if (data.emprole === element.title) {
                    role_id = element.id;
                    console.log(`I am role ${role_id}`);
                }
            });

            mangerList.forEach(element => {
                var empName = element.first_name.concat(" ", element.last_name);
                if (data.manager === empName)
                    manager_id = element.id;
            });

            db.query(`INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES ('${data.firstname}', '${data.lastname}', '${role_id}', '${manager_id}')`);
            console.log(`{empName} updated to employee table`);
        })
        .catch(error => {
            console.log(`Error occurred in add Employee ${error}`);
        });
    displayoptions();
};

//updates role of employee  to employee table
function updateEmpRole() {

};

//retrieves all role details from role table
async function getRoles() {
    const roleList = await getRoleList();
    console.table(roleList);
    displayoptions();
};

//adds a new role to role table
async function addRole() {
    const depList = await getDepList();
    const rolePrompts = [
        {
            type: 'input',
            name: 'title',
            message: 'Enter Title for Role:',
        },
        {
            type: 'input',
            name: 'salary',
            message: 'Enter Salary for Role:',
        },
        {
            type: 'rawlist',
            id: 'dept_id',
            name: 'dept_name',
            message: 'What is department',
            choices: depList,
        },
    ];

    await inquirer.prompt(rolePrompts)
        .then(data => {

            depList.forEach(element => {
                if (data.dept_name === element.name) {
                    dept_id = element.id;
                    console.log(`I am ${dept_id}`);
                }
            });


            db.query(`INSERT INTO role(title, salary, department_id) VALUES ('${data.title}', '${data.salary}', '${dept_id}')`);
            console.log(`{data.title} updated to role table`);
        })
        .catch(error => {
            console.log(`Error occurred during add role ${error}`);
        })
    displayoptions();
};

//adds a new department to department table
async function addDepartment() {
    // Inquirer for Add Department
    const depPrompts = [
        {
            type: 'input',
            name: 'depName',
            message: 'Enter Department Name:',
        },
    ];

    await inquirer.prompt(depPrompts)
        .then(data => {
            db.query(`INSERT INTO department(name) VALUES ('${data.depName}')`);
            console.log(`{data.depName} updated to Department table`);
        })
        .catch(error => {
            console.log(`Error occurred during add department ${error}`);
        })

    displayoptions();
};

//retrieves all department from department table
async function getDepartment() {
    const depList = await getDepList();
    console.table(depList);
    displayoptions();
};

//retrieves all department from department table
const getDepList = () => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM department', (err, results) => {
            err ? reject(err) : resolve(results)
        });
    });
};

//retrieves all roles from role table
const getRoleList = () => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM role', (err, results) => {
            err ? reject(err) : resolve(results);
        });
    });
};

//retrieves all managers from employee table
const getEmployeeList = () => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM employee', (err, results) => {
            err ? reject(err) : resolve(results);
        });
    });
};

