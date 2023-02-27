import mainSlice, { loginUserState, logoutUserState } from "./mainSlice";
import store from "./store";
import { User } from "./types";

const initialState = mainSlice.getInitialState();
const sampleUser: User = {
    id: "some-id",
    username: "test",
    email: "email@email.com",
    role: "admin"
}
const currentState = () => store.getState();

describe("Main slice tests", () => {
    
    it("Initialise slice correctly", () => {
      expect(initialState).toEqual({user: null});
    });

    it("Login user action updates state and localStorage correctly", () => {
        expect(currentState().user).toBeNull();
        expect(localStorage.getItem("username")).toBeNull();
        store.dispatch(loginUserState({user: sampleUser}));
        expect(currentState().user).toEqual(sampleUser);
        expect(localStorage.getItem("username")).toBe(sampleUser.username);
    });

    it("Logout user action updates state and localStorage correctly", () => {
        store.dispatch(loginUserState({user: sampleUser}));
        expect(currentState().user).toEqual(sampleUser);
        expect(localStorage.getItem("username")).toBe(sampleUser.username);

        store.dispatch(logoutUserState());
        expect(currentState().user).toBeNull();
        expect(localStorage.getItem("username")).toBeNull();
    });
  
  });