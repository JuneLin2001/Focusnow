import LoginButton from "./LoginButton";
import useAuthStore from "../store/authStore";

const Header = () => {
  const { user } = useAuthStore();

  const handleLoginSuccess = () => {
    console.log("handleLoginSuccess");
  };

  return (
    <div className="fixed flex justify-center items-center w-full h-16 mb-5 py-10 bg-[#D9D9D9]  z-50">
      {user ? (
        <div className="flex items-center mr-5">
          {user.photoURL && (
            <img
              src={user.photoURL}
              alt="User Photo"
              className="w-12 h-12 rounded-full mr-4"
            />
          )}
          <div>
            <div className="text-xl font-semibold">{user.displayName}</div>
            <div className="text-gray-600">{user.email}</div>
          </div>
        </div>
      ) : (
        <div className="mb-4 text-gray-600">Not logged in</div>
      )}
      <LoginButton onLoginSuccess={handleLoginSuccess} />
    </div>
  );
};

export default Header;
