const users = [];

// addUser, removeUser, getUser, getUsersInRoom

const addUser = ({ id, username, room }) => {
  // Clean the data
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  // Validate the data
  if (!username || !room) {
    return {
      error: "Username and room are required!"
    };
  }

  // Check for existing user
  const existingUser = users.find(user => {
    return user.room === room && user.username === username;
  });

  // Validate username

  if (existingUser) {
    return {
      error: "Username is in use!"
    };
  }

  // Store user
  const user = { id, username, room };
  users.push(user);
  return { user };
};

const removeUser = id => {
  const index = users.findIndex(user => {
    return user.id === id;
  });

  if (index !== -1) {
    const spl = users.splice(index, 1)[0];
    // console.log(spl);
    return spl;
  }
};

const getUser = id => {
  const user = users.find(user => {
    return user.id === id;
  });

  return user;
};

const getUsersInRoom = room => {
  room = room.trim().toLowerCase();
  const clients = users.filter(user => {
    return user.room === room;
  });
  return clients;
};

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom
};
// ####################### TEST THE WORK ###################
// addUser({
//   id: 22,
//   username: " Ermias  ",
//   room: "  leicester  "
// });

// addUser({
//   id: 33,
//   username: "tom",
//   room: "leicester"
// });

// addUser({
//   id: 42,
//   username: "Andrew",
//   room: "Phily"
// });

// const removedUser = removeUser(33);
// console.log(removedUser + " for remove");
// const client = getUser(42);
// console.log(client);
// const clients = getUsersInRoom("phily");
// console.log(clients);
// console.log(users);
