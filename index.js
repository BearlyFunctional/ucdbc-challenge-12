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
            addToTable('employees')
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
                const selectedDep = returnRow('departments', response.roleDepartment, 'dep_name')
                setTimeout(() => {
                    const newAddition = [selectedDep[0], response.roleTitle, response.roleSalary]
                    console.log(selectedDep[0])
                    updateTable(tableName, newAddition)
                }, 100);
            })
        }, 500);
    }

    if (tableName == 'employees') {
        const rolesList = returnColumn('roles', 'title')
        const empsList = returnColumn('employees', 'first_name')
        setTimeout(() => {
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'empRole',
                    message: "What is this employee's role? ",
                    choices: rolesList
                },
                {
                    type: 'list',
                    name: 'empManager',
                    message: "Who is this employee's manager? ",
                    choices: empsList
                },
                {
                    name: 'first_name',
                    message: "What is this employee's first name?: "
                },
                {
                    name: 'last_name',
                    message: "What is this employee's last name?: "
                },
            ]) .then ((response) => {
                const selectedRole = returnRow('roles', response.empRole, 'title')
                const selectedManager = returnRow('employees', response.empManager, 'first_name')
                setTimeout(() => {
                    const newAddition = [selectedRole[0], selectedManager[0], response.first_name, response.last_name]
                    updateTable(tableName, newAddition)
                }, 100);
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

const returnRow = (reqTable, reqRow, reqItem) => {
    let desiredRow = []
    dataBase.query(`SELECT * FROM ${reqTable} WHERE ${reqItem} = '${reqRow}'`, (err, result) => {
        if (err) {
            console.log(err)
        } else {
            for (let i = 0; i < result.length; i++) {
                const element = result[i];
                desiredRow.push(Object.values(result[i])[0])
            }
        }
    })
    return desiredRow
}

mainMenu()

// const response = {roleDepartment: 'Front'}

// const test = returnRow('departments', response.roleDepartment)

// setTimeout(() => {
//     console.log(test[0])
// }, 1000);