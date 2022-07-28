// //packages
// const fs = require('fs');
//Inquirer package
const inquirer = require('inquirer');
//import and require mysql
const mysql = require('mysql2');
const ctable = require('console.table');

const { exit } = require('process');

// //import class and prompts
// const { Department, depPrompts } = require('./lib/department');
// const { Employee, empPrompts } = require('./lib/employee');
// const { Role, rolePrompts } = require('./lib/role');

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'Learning@2121',
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

// Inquirer for Add Department
const depPrompts = [
    {
        type: 'input',
        name: 'depName',
        message: 'Enter Department Name:',
    },
];

// //inquirer to add role
// const rolePrompts = [
//     {
//         type: 'input',
//         name: 'title',
//         message: 'Enter Title for Role:',
//     },
//     {
//         type: 'input',
//         name: 'salary',
//         message: 'Enter Salary for Role:',
//     },
//     {
//         type: 'rawlist',
//         name: 'dept_id',
//         message: 'What is department',
//         choices: getDepList(),
//     },
// ];

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
function getEmployeeData() {
    console.log("Employee");
};

// //adds a new employee to employee table
// async function addEmployee() {
//     await inquirer.prompt(empPrompts)
//         .then(data => {
//             const employee = new Employee(data.firstName, data.lastName);
//             const sql = employee.addEmployee();
//             Connection.createQuery(sql, [data.firstName, data.lastName], (err, result) => {
//                 err ? console.log(err) : console.log(`Added ${data.firstName} ${data.lastName} to employee table`)
//             })
//         })
//         .catch(error => {
//             console.log(`Error occurred in add Employee ${error}`);
//         })
// };

// //updates role of employee  to employee table
// function updateEmpRole() {

// };

//retrieves all role details from role table
async function getRoles() {
    await new Promise((resolve, reject) => {
        db.query('SELECT * FROM role', (err, results) => {
            err ? reject(console.error(err)) : resolve(console.table(results));
        })
    });
    
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

