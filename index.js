require('dotenv').config();

//Inquirer package
const inquirer = require('inquirer');
//import and require mysql
const mysql = require('mysql2');
const { resolve } = require('path');

const { exit } = require('process');

//establishes connection to database
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
                    getEmployee();
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
async function getEmployee() {
    const employeeData = await getEmployeeData();
    console.table(employeeData);
    displayoptions();
};

//adds a new employee to employee table
async function addEmployee() {

    //gets data from role table to display different roles available for inquirer choices
    const roleList = await getRoleList();
    var roles = [];
    roleList.forEach(element => {
        roles.push(element.title);
    });

    //gets data from employee table to display all managers for inquirer choices 
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

            //converts the user selected role title to role id - to add data to employee table
            roleList.forEach(element => {
                if (data.emprole === element.title) {
                    role_id = element.id;
                    console.log(`I am role ${role_id}`);
                }
            });

            //converts the user selected manager name to id - to add data to emplpoyee table
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
async function updateEmpRole() {

    //gets data from role table to display all roles for inquirer choices 
    const roleList = await getRoleList();
    var roles = [];
    roleList.forEach(element => {
        roles.push(element.title);
    });

    //gets data from employee table to display all employees(fullname) for inquirer manager choices
    const employeeList = await getEmployeeList();
    var employees = [];
    employeeList.forEach(element => {
        employees.push(element.first_name.concat(" ", element.last_name));
    });

    //inquirer for update employee role
    const empPrompts = [
        {
            type: 'rawlist',
            name: 'empname',
            message: 'Select Employee Name:',
            choices: employees,
        },
        {
            type: 'rawlist',
            name: 'emprole',
            message: 'Select New Role for Emmployee:',
            choices: roles,
        },
    ];
    await inquirer.prompt(empPrompts)
        .then(data => {
            var empID;
            var roleID;
            console.log(roleList);

            roleList.forEach(element => {
                if (data.emprole === element.title) {
                    roleID = element.id
                }
            });

            employeeList.forEach(element => {
                if (data.empname === element.first_name.concat(" ", element.last_name)) {
                    empID = element.id

                }
            });
            db.query(`UPDATE employee SET role_id = ${roleID} WHERE id = ${empID}`);


        })
        .catch(error => {
            console.log(`Error occurred during update employee role ${error}`);
        })
    displayoptions();

};

//retrieves all role details from role table
async function getRoles() {
    const roleData = await getRoledata();
    console.table(roleData);
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

//retrives all role data from role table to display role details
const getRoledata = () => {
    return new Promise((resolve, reject) => {
        db.query('SELECT title, salary, name AS department_name FROM role JOIN department ON role.department_id = department.id', (err, results) => {
            err ? reject(err) : resolve(results);
        });
    });
};

//retrives all employee data from employee to display employee details
const getEmployeeData = () => {
    var sql = 'SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name as department_name, role.salary, CONCAT(e.first_name, " ", e.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id  LEFT JOIN department on role.department_id = department.id LEFT JOIN employee e on employee.manager_id = e.id';
    return new Promise((resolve, reject) => {
        db.query(sql, (err, results) => {
            err ? reject(err) : resolve(results);
        });
    });
};

