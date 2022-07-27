class Role {
    constructor(title, salary){
        this.title = title;
        this.salary = salary;
    }

//function that helps to add role to role table
addRole(){

}
}

//inquirer to add role
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
];

module.exports = {Role, rolePrompts};