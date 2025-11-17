import { useAuth } from '../../hooks/useAuth';

const MyProfile = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-4">My Profile</h1>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-600">Name</label>
            <p className="text-lg font-medium">{user?.name}</p>
          </div>
          <div>
            <label className="text-sm text-gray-600">Email</label>
            <p className="text-lg font-medium">{user?.email}</p>
          </div>
          <div>
            <label className="text-sm text-gray-600">Employee ID</label>
            <p className="text-lg font-medium">{user?.employeeId}</p>
          </div>
          <div>
            <label className="text-sm text-gray-600">Department</label>
            <p className="text-lg font-medium">{user?.department}</p>
          </div>
          <div>
            <label className="text-sm text-gray-600">Designation</label>
            <p className="text-lg font-medium">{user?.designation}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
