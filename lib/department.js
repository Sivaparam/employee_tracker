class Department {
    constructor(name) {
        this.name = name;
    }

    //fucntion that helps to add department to department table
    addDepartment() {
        return (`INSERT INTO department(name) VALUES (?)`)
    }

    displayDepartment() {
        return (`SELECT name FROM department`)
    }
}

//inquirer for add department
const depPrompts = [
    {
        type: 'input',
        name: 'depName',
        message: 'Enter Department Name:',
    },
];


module.exports = { Department, depPrompts };


