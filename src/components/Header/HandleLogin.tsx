import useAuthStore from "../../store/authStore";

const HandleLogin = () => {
  const { user } = useAuthStore();

  return (
    <>
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
    </>
  );
};

export default HandleLogin;
