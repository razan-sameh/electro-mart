// components/UserButton.tsx
import { FaUser } from "react-icons/fa";
import IconButton from "./IconButton";
import { useRouter } from "@/i18n/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { FaCheck } from "react-icons/fa";

export default function UserButton() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const handleUserClick = () => {
    if (isAuthenticated) {
      router.push("/profile");
    } else {
      router.push("/login");
    }
  };

  return (
    <div className="relative">
      <IconButton onClick={handleUserClick}>
        <FaUser size={20} />
      </IconButton>

      {isAuthenticated && (
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-[#1FC16B] rounded-full flex items-center justify-center">
          <FaCheck size={8} color="white" />
        </div>
      )}
    </div>
  );
}
