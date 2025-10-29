import { render, screen } from "@testing-library/react";
import ProjectForm from "../src/components/ProjectForm";

const mockPolygon = {
  id: 1,
  coordinates: "POLYGON((36.82 -1.29, 36.83 -1.30))",
};

describe("ProjectForm (Simple Test)", () => {
  test("renders form fields when a polygon is selected", () => {
    render(<ProjectForm selectedPolygon={mockPolygon} />);

    
    expect(screen.getByPlaceholderText(/Fairview Holiday Homes/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/1km2/i)).toBeInTheDocument();
    expect(screen.getByText(/Project Type:/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Brief project details/i)).toBeInTheDocument();
  });
});
