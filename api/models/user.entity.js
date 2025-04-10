// models/user.entity.js
class User {
    constructor({ staff_id, username, password }) {
        this.staff_id = staff_id;        
        this.username = username;
        this.password = password;
    }
}
// insert into staff(first_name,last_name,address_id,username,password) values ('John','Doe',3,'jhon','Admin.123')
module.exports = User;