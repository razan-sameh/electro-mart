// components/UserButton.tsx
import { FaUser } from "react-icons/fa";
import IconButton from "./IconButton";

export default function UserButton() {
  const handleUserClick = () => {
    console.log("Go to profile");
    // Add your user profile logic here
  };

  return (
    <IconButton onClick={handleUserClick}>
      <FaUser size={20} />
    </IconButton>
  );
}