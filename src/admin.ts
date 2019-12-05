import {User, Group, Specialty, init} from "./models";
import readline from "readline";

console.log("Starting admin manager ...");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

init().then(() => {
    console.log("\nAdmin manager started !\n");
    showMenu();
});

function showMenu() {
    console.log("What do you want to do ?");
    console.log("1. Create admin user");
    console.log("2. List admin users");
    console.log("3. Remove admin user");
    console.log("4. Generate default specialties and groups");
    console.log("\n");

    rl.question("Enter action to execute (number): ", (answer) => {
        switch(answer) {
            case "1":
                createAdminUser();
                break;
            case "2":
                listAdminUsers();
                break;
            case "3":
                removeAdminUser();
                break;
            case "4":
                createGroupsAndSpecialties();
                break;
            default:
                console.log("Unvalid option. Exiting.");
                rl.close();
        }
    });
}

function createAdminUser() {
    rl.question("Firstname: ", (firstname) => {
        if (firstname.length == 0) {
            console.log("The firstname can't be empty. Exiting.");
            rl.close();
        } else {
            rl.question("Lastname: ", (lastname) => {
                if (lastname.length == 0) {
                    console.log("The lastname can't be empty. Exiting.");
                    rl.close();
                } else {
                    rl.question("Email: ", (email) => {
                        if (email.length == 0) {
                            console.log("The email can't be empty. Exiting.");
                            rl.close();
                        } else {
                            if (!/^[^@]+@[^@]+\..+$/.test(email)) {
                                console.log("WARNING: Your email looks unvalid.");
                            }
                            // TODO: Don't show password when typed in console
                            rl.question("Password: ", (password) => {
                                if(password.length == 0) {
                                    console.log("Password can't be empty. Exiting.");
                                    rl.close();
                                } else {
                                    rl.question("Confirm password: ", (confirmPassword) => {
                                        if (password !== confirmPassword) {
                                            console.log("Passwords not matching. Exiting.");
                                            rl.close();
                                        } else {
                                            User.createSafe(firstname, lastname, password, email, true).then((user) => {
                                                console.log(`Admin user ${user.firstname} ${user.lastname} created successfully`);
                                                rl.close();
                                            }).catch((err: any) => {
                                                console.error("Unable to create admin user.");
                                                console.error(err);
                                                rl.close();
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
}

function listAdminUsers() {
    User.findAll({
        where: {
            isAdmin: true,   
        },
    }).then((admins) => {
        console.log("\nList of admins:");
        admins.forEach((admin) => {
            console.log(`- ${admin.firstname} ${admin.lastname} (${admin.email})`);
        });
        rl.close();
    });
}

function removeAdminUser() {
    rl.question("Enter the email of the admin user you want to remove: ", (email) => {
        User.findOne({
            where: {
                email,
                isAdmin: true,
            }
        }).then((user) => {
            user.destroy();
            console.log(`User ${user.firstname} ${user.lastname} (${user.email}) removed successfully.`);
            rl.close();
        }).catch(() => {
            console.log(`No admin user with email ${email} found.`);
            rl.close();
        });
    });
}

function createGroupsAndSpecialties() {

    let createAll = async function() {
        for (var i = 1; i <= 2; i++) {
            let [specialty, _] = await Specialty.findOrCreate({
                where: {
                    name: "PEIP",
                    year: i,
                },
            });
            
            for (var j = 1; j <= 3; j++) {
                await Group.findOrCreate({
                    where: {
                        num: j,
                        specialtyId: specialty.id
                    },
                });
            }
        }
        const sections = ["IG", "STE", "MEA", "MI", "GBA", "MAT", "MSI", "SE", "EGC"];
        for(let k in sections) {
            for(var i = 3; i <= 5; i++) {
                let [spe, _] = await Specialty.findOrCreate({
                    where: {
                        name: sections[k],
                        year: i
                    },
                });
                
                for (var j = 1; j <= 2; j++) {
                    await Group.findOrCreate({
                        where: {
                            num: j,
                            specialtyId: spe.id
                        },
                    });
                }
            }
        }
    };

    createAll().then(() => {
        console.log("Finished. Exiting.");
        rl.close();
    }).catch((err) => {
        console.error("Unable to populate database. Exiting.");
        console.error(err);
        rl.close();
    });

}