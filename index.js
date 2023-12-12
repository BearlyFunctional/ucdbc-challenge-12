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
            addToTable('departments')
        } if (res.mainMenu == menuChoices[2]) {
            viewTable('roles')
        } if (res.mainMenu == menuChoices[3]) {
            addToTable('roles')
        } if (res.mainMenu == menuChoices[4]) {
            viewTable('employees')
        } if (res.mainMenu == menuChoices[5]) {
            console.log('TODO')
        } if (res.mainMenu == menuChoices[6]) {
            console.log('TODO')
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


const addToTable = (tableName) => {

    if (tableName == 'departments') {
        setTimeout(() => {
            inquirer.prompt([
                {
                    name: 'depName',
                    message: 'Please enter the desired name for this new department: '
                }
            ]) .then ((response) => {
                const newAddition = [response.depName]
                updateTable(tableName, newAddition)
            })
        }, 500);
    }

    if (tableName == 'roles') {
        const columnList = returnColumn('departments', 'dep_name')
        setTimeout(() => {
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'roleDepartment',
                    message: 'What department is this role a part of? ',
                    choices: columnList
                },
                {
                    name: 'roleTitle',
                    message: 'Please enter the desired title for this new role: '
                },
                {
                    name: 'roleSalary',
                    message: 'Please enter the desired salary for this new role: '
                }
            ]) .then ((response) => {
                const newAddition = [response.roleDepartment, response.roleTitle, response.roleSalary]
                updateTable(tableName, newAddition)
            })
        }, 500);
    }

    if (tableName == 'employees') {
        setTimeout(() => {
            inquirer.prompt([
                {
                    name: 'first_name',
                    message: "What is this employee's first name?: "
                },
                {
                    name: 'last_name',
                    message: "What is this employee's last name?: "
                },
            ]) .then ((response) => {
                const newAddition = ['role_id', 'manager_id', response.first_name, response.last_name]
                updateTable(tableName, newAddition)
            })
        }, 500);
    }

}


const updateTable = (tableName, newAddition) => {
    let columns
    let columnsNum
    
    if (tableName == 'departments') {
        columns = 'dep_name'
        columnsNum = '?'
    }

    if (tableName == 'roles') {
        columns = 'dep_id, title, salary'
        columnsNum = '?, ?, ?'
    }

    if (tableName == 'employees') {
        columns = 'role_id, manager_id, first_name, last_name'
        columnsNum = '?, ?, ?, ?'
    }
    
    dataBase.query(`INSERT INTO ${tableName} (${columns}) VALUES (${columnsNum})`, newAddition, (err) => {
        if (err) {
            console.log(err)
        } else {
            console.log('New entry successfully added!')
            viewTable(tableName)
        }
    })
}

const returnColumn = (reqTable, reqColumn) => {
    let columnList = []
    dataBase.query(`SELECT ${reqColumn} FROM ${reqTable}`, (err, result) => {
        if (err) {
            console.log(err)
        } else {
            for (let i = 0; i < result.length; i++) {
                const element = result[i];
                columnList.push(Object.values(result[i])[0])
            }
        }
    })
    return columnList
}


mainMenu()