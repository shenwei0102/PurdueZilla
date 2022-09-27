import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, push, onValue, } from "firebase/database";
import { getAnalytics } from "firebase/analytics";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";



/*****
 *  
 * Configurations
 *
*****/

const firebaseConfig = {
    apiKey: "AIzaSyCo0gPK4fEqqPd5WgmhISKfy1P8AgPmf3Y",
    authDomain: "purduezilla.firebaseapp.com",
    databaseURL: "https://purduezilla-default-rtdb.firebaseio.com",
    projectId: "purduezilla",
    storageBucket: "purduezilla.appspot.com",
    messagingSenderId: "1043168052788",
    appId: "1:1043168052788:web:be5443766ed89f9479ac61",
    measurementId: "G-9G4NCBXCZX"
};

// Initialze firebase
const app = initializeApp(firebaseConfig);
// Initialize analytics
const analytics = getAnalytics(app);
//initialize db
const db = getDatabase(app);

/*****
 *  
 * Write functions
 *
*****/

// Create new user
// Does not authenticate user
const createNewUser = function createNewUser(email, firstName, lastName, profileDescription, notificationSetting) {
    // TODO: need to check for unique email before user is created
    
    const userListRef = ref(db, 'users');
    const newUserRef = push(userListRef);
    set(newUserRef, {
        email: email,
        firstName: firstName,
        lastName: lastName,
        profileDescription: profileDescription,
        notificationSetting: notificationSetting,
    });

}

// Create new group
const createNewGroup = function createNewGroup(name, memberIds, ownerIds) {
    
    const groupListRef = ref(db, 'groups');
    const newGroupRef = push(groupListRef);
    set(newGroupRef, {
        name: name
    });

    // Add owner user Id's
    const ownersListRef = ref(db, 'groups/' + newGroupRef.key + '/owners');
    for (const i in ownerIds) {
        const userRef = push(ownersListRef);
        set(userRef, {
            userId: ownerIds[i]
        });
    }

    // Add member user Id's
    const memberListRef = ref(db, 'groups/' + newGroupRef.key + '/members');
    for (const i in memberIds) {
        const userRef = push(memberListRef);
        set(userRef, {
            userId: memberIds[i]
        });
    }

}

// Create new project
// To get all tasks associated with project, query 'tasks' by project id
const createNewProject = function createNewProject(name, description, status, memberIds, ownerIds) {
    
    const projectListRef = ref(db, 'projects');
    const newProjectRef = push(projectListRef);
    set(newProjectRef, {
        name: name,
        description: description,
        status: status
    });

    // Add owner user Id's
    const ownersListRef = ref(db, 'projects/' + newProjectRef.key + '/owners');
    for (const i in ownerIds) {
        const userRef = push(ownersListRef);
        set(userRef, {
            userId: ownerIds[i]
        });
    }

    // Add member user Id's
    const memberListRef = ref(db, 'projects/' + newProjectRef.key + '/members');
    for (const i in memberIds) {
        const userRef = push(memberListRef);
        set(userRef, {
            userId: memberIds[i]
        });
    }

}

// Create new task
// permittedUserIds, ownerIds, assignedUserIds, followerIds must be arrays
const createNewTask = function createNewTask(projectId, title, description, estimatedTime, status, permittedUserIds, ownerIds, assignedUserIds, followerIds) {

    // Create basic task
    const taskListRef = ref(db, 'tasks');
    const newTaskRef = push(taskListRef);
    set(newTaskRef, {
        projectId: projectId,
        title: title,
        description: description,
        estimatedTime: estimatedTime,
        status: status,
    });

    // Add permitted user Id's
    const permittedUsersListRef = ref(db, 'tasks/' + newTaskRef.key + '/permittedUsers');
    for (const i in permittedUserIds) {
        const userRef = push(permittedUsersListRef);
        set(userRef, {
            userId: permittedUserIds[i]
        });
    }

    // Add owner user Id's
    const ownersListRef = ref(db, 'tasks/' + newTaskRef.key + '/owners');
    for (const i in ownerIds) {
        const userRef = push(ownersListRef);
        set(userRef, {
            userId: ownerIds[i]
        });
    }

    // Add assigned user Id's
    const assignedUserListRef = ref(db, 'tasks/' + newTaskRef.key + '/assignedUsers');
    for (const i in assignedUserIds) {
        const userRef = push(assignedUserListRef);
        set(userRef, {
            userId: assignedUserIds[i]
        });
    }

    // Add follower user Id's
    const followersListRef = ref(db, 'tasks/' + newTaskRef.key + '/followers');
    for (const i in followerIds) {
        const userRef = push(followersListRef);
        set(userRef, {
            userId: followerIds[i]
        });
    }

}

/*****
 *  
 * Auth functions
 *
*****/

// Create user account with email password authentication
const createAccount = (email, password) => {
    //maybe initialize outside? -PJ
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in 
            // We need to set user in context
            const user = userCredential.user;
            // for now print out user
            console.log(user);
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            //change these later to actually do something meaningfull
            console.log(errorCode);
            console.log(errorMessage);
        });
    /*
    TODO - get user info into our database when they create an account - JM

    writeUserData(username, email, firstName, lastName, profileDescription, notificationSetting);
    */
}

const trySignInAccount = async (email, password) => {
    //also maybe initialize outside
    const auth = getAuth();
    let result = await signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            //temperary print
            console.log("success")
            console.log(user);
            // ...
            return true;
        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            // temporary print
            console.log(errorCode);
            console.log(errorMessage);
            return false;
        });
    return result
}

//sign out account
const signOutAccount = () => {
    //once again probably initialize outside
    const auth = getAuth();
    signOut(auth).then(() => {
        console.log("signed out successfully");
    }).catch((error) => {
        console.log("wasn't able to sign out :(");
    });
}

/*****
 *  
 * Read functions
 *
*****/

// Reads all user information from db and gets/retrieves every time a change is made
// Need a listener that recieves snapshot; can get data in snapshot with val() method
/*
const db = getDatabase(app);
const userRef = ref(db, 'users/' + username);
onValue(userRef, (snapshot) => ) {
    const data = snapshot.val();
    getUserData(userData, data)
}
*/

//wrap all functions up to export all at the same time
//considering moving the authentication functions to a different file? - PJ
const apiFunctions = {
    createNewUser,
    createNewGroup,
    createNewProject,
    createNewTask,
    createAccount,
    trySignInAccount,
    signOutAccount,
};

export default apiFunctions;