import { render, screen, fireEvent } from "@testing-library/react";
import CommunityPostCard from "../src/components/CommunityPostCard";


jest.mock("next/image", () => (props) => (
  
  <img {...props} alt={props.alt} />
));

const samplePost = {
  id: 10,
  title: "Illegal Dumping Site",
  description: "There is waste piling behind the estate.",
  location: "Lang'ata",
  image_url: "http://example.com/photo.jpg",
  created_at: "2025-01-15",
  username: "JohnDoe",
  user_id: 5,
};

describe("CommunityPostCard Component", () => {
  test("renders post content correctly", () => {
    render(<CommunityPostCard post={samplePost} />);

    expect(screen.getByText("Illegal Dumping Site")).toBeInTheDocument();
    expect(screen.getByText("There is waste piling behind the estate.")).toBeInTheDocument();
    expect(screen.getByText("Lang'ata")).toBeInTheDocument();
    expect(screen.getByText("Jan", { exact: false })).toBeInTheDocument(); // formatted date
    expect(screen.getByText("Posted by:")).toBeInTheDocument();
    expect(screen.getByText("JohnDoe")).toBeInTheDocument();

    
    expect(screen.getByAltText("Illegal Dumping Site")).toBeInTheDocument();
  });

  test("does NOT show edit/delete buttons when user is NOT owner", () => {
    render(<CommunityPostCard post={samplePost} currentUserId={3} />);

    expect(screen.queryByLabelText("Edit post")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Delete post")).not.toBeInTheDocument();
  });

  test("shows edit/delete buttons when user IS owner", () => {
    render(<CommunityPostCard post={samplePost} currentUserId={5} />);

    expect(screen.getByLabelText("Edit post")).toBeInTheDocument();
    expect(screen.getByLabelText("Delete post")).toBeInTheDocument();
  });

  test("calls onEdit when edit button is clicked", () => {
    const mockEdit = jest.fn();

    render(
      <CommunityPostCard
        post={samplePost}
        currentUserId={5}
        onEdit={mockEdit}
      />
    );

    fireEvent.click(screen.getByLabelText("Edit post"));
    expect(mockEdit).toHaveBeenCalledWith(samplePost);
  });

  test("calls onDelete when delete button is clicked", () => {
    const mockDelete = jest.fn();

    render(
      <CommunityPostCard
        post={samplePost}
        currentUserId={5}
        onDelete={mockDelete}
      />
    );

    fireEvent.click(screen.getByLabelText("Delete post"));
    expect(mockDelete).toHaveBeenCalledWith(10);
  });
});
