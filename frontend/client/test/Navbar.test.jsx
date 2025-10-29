import { render, screen } from "@testing-library/react";
import Navbar from "../src/components/Navbar";
import { UserContext } from "../src/context/UserContext";


jest.mock("next/image", () => (props) => (
  
  <img {...props} alt={props.alt} />
));

describe("Navbar (Simple Tests)", () => {
  test("shows 'Get Started' when no user is logged in", () => {
    render(
      <UserContext.Provider value={{ user: null, setUser: jest.fn() }}>
        <Navbar />
      </UserContext.Provider>
    );

    expect(screen.getByText("Get Started")).toBeInTheDocument();
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Explore")).toBeInTheDocument();
    expect(screen.getByText("Community")).toBeInTheDocument();
  });

  test("shows 'Log Out' when user *is* logged in", () => {
    render(
      <UserContext.Provider value={{ user: { name: "Test" }, setUser: jest.fn() }}>
        <Navbar />
      </UserContext.Provider>
    );

    expect(screen.getByText("Log Out")).toBeInTheDocument();
    expect(screen.getByText("Development")).toBeInTheDocument();
  });
});
