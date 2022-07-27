class Employee {
    constructor(firstName, lastName){
        this.firstName = firstName;
        this.lastName = lastName;
    }

//function that helps to add employee to employee table
addEmployee(){

}
}

//inquirer for add employee
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
];

module.exports = {Employee, empPrompts};