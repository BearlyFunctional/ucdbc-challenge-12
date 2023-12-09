const inquirer = require('inquirer')
const dataBase = require('./config/connection')
const menuChoices = ['View all departments', 'Add a department', 'View all roles', 'Add a role','View all employees', 'Add an employee', 'Update an employee role']


const mainMenu = () => {
    inquirer.prompt([
        {
            type: 'list',
            name: 'mainMenu',
            message: 'What would you like to do?',
            choices: ['View all departments', 'Add a department', new inquirer.Separator(), 'View all roles', 'Add a role', new inquirer.Separator(), 'View all employees', 'Add an employee', 'Update an employee role', new inquirer.Separator(),]
        }
    ]) .then ((res) => {
        if (res.mainMenu == menuChoices[0]) {
            viewTable('departments')
        } if (res.mainMenu == menuChoices[1]) {
            console.log('addDeps')
        } if (res.mainMenu == menuChoices[2]) {
            viewTable('roles')
        } if (res.mainMenu == menuChoices[3]) {
            console.log('addRoles')
        } if (res.mainMenu == menuChoices[4]) {
            viewTable('employees')
        } if (res.mainMenu == menuChoices[5]) {
            console.log('addEmps')
        } if (res.mainMenu == menuChoices[6]) {
            console.log('updateEmps')
        }
    })
}

const viewTable = (tableName) => {
    dataBase.query(`SELECT * FROM ${tableName}`, (err, result) => {
      if (err) {
        console.log(err);
        return;
      } else {
        console.log(result)
        setTimeout(() => {
            mainMenu()
        }, 2000);
      }
    })
}

mainMenu()