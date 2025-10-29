import { render, screen, fireEvent } from "@testing-library/react";
import CommunityForm from "../src/components/CommunityForm";
import { UserContext } from "../src/context/UserContext";


beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation((msg) => {
    if (
      !msg.toString().includes("A component is changing a controlled input to be uncontrolled") &&
      !msg.toString().includes("A component is changing an uncontrolled input to be controlled")
    ) {
      console.error(msg);
    }
  });
});

const mockUser = { id: 1, username: "TestUser" };

const renderForm = (props = {}) =>
  render(
    <UserContext.Provider value={{ user: mockUser }}>
      <CommunityForm onSubmit={jest.fn()} {...props} />
    </UserContext.Provider>
  );

describe("CommunityForm", () => {
  test("renders basic fields", () => {
    renderForm();

    expect(screen.getByPlaceholderText(/Illegal Dumping Site/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Paste image URL/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Describe the environmental issue/i)).toBeInTheDocument();
    expect(screen.getByText(/Location \*/i)).toBeInTheDocument();
  });

  test("pre-fills fields when editing", () => {
    const editingPost = {
      id: 5,
      title: "Edit Title",
      image_url: "http://test.com/img.jpg",
      location: "Lang'ata",
      description: "Old desc",
    };

    renderForm({ editingPost });

    expect(screen.getByDisplayValue("Edit Title")).toBeInTheDocument();
    expect(screen.getByDisplayValue("http://test.com/img.jpg")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Old desc")).toBeInTheDocument();
  });

  test("does not submit when empty form", () => {
    const mockSubmit = jest.fn();
    renderForm({ onSubmit: mockSubmit });

    fireEvent.click(screen.getByText(/submit/i));
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  test("calls onCancelEdit when cancel clicked in edit mode", () => {
    const mockCancel = jest.fn();
    renderForm({
      editingPost: { id: 10, title: "Edit" },
      onCancelEdit: mockCancel,
    });

    fireEvent.click(screen.getByText(/cancel/i));
    expect(mockCancel).toHaveBeenCalled();
  });
});
