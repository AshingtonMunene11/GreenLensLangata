import { render, screen, waitFor } from "@testing-library/react";
import YourProjects from "../src/components/YourProjects";


jest.mock("next/image", () => (props) => <img {...props} alt={props.alt} />);


jest.mock("../src/components/Navbar", () => () => <div data-testid="navbar" />);


const mockProjects = [
  {
    id: 1,
    title: "Green Park",
    description: "Eco friendly zone",
    area_size: 500,
    type: "Residential",
    coordinates: "POLYGON((...))",
  },
];

describe("YourProjects (Simple Test)", () => {
  beforeEach(() => {
    
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: async () => mockProjects,
      })
    );
  });

  afterEach(() => jest.resetAllMocks());

  test("renders project list after loading", async () => {
    render(<YourProjects />);

    
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    
    await waitFor(() => {
      expect(screen.getByText("Green Park")).toBeInTheDocument();
    });

   
    expect(screen.getByText(/\(1\)/)).toBeInTheDocument();
  });
});
