// components/UserButton.tsx
import { FaUser } from "react-icons/fa";
import IconButton from "./IconButton";
import { useRouter } from "@/i18n/navigation";

export default function UserButton() {
  const router = useRouter();

  const handleUserClick = () => {
    router.push("/profile");
  };

  return (
    <IconButton onClick={handleUserClick}>
      <FaUser size={20} />
    </IconButton>
  );
}
