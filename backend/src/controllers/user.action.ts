import User from "../models/userModel";
("use server");

export async function createUser(user: any) {
  try {
    const newUser = new User(user);
    return JSON.parse(JSON.stringify(newUser));
  } catch (error) {
    console.log("Error in createUser", error);
  }
}
