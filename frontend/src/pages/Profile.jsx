import { useState, useEffect } from "react";
import { FaUserGraduate, FaEdit } from "react-icons/fa";
import "../styles/Profile.css";
import { toast } from "react-toastify";
import axios from "axios";

function Profile() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/profile/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load profile");
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser((prev) => ({ ...prev, photo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("name", user.name);
      formData.append("email", user.email);
      formData.append("level", user.level);
      formData.append("department",user.department);
      if (photoFile) {
        formData.append("photo", photoFile);
      }

      const res = await axios.put("http://localhost:5000/api/profile/me", formData, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setUser(res.data);
      toast.success("Profile updated successfully!");
      setIsEditing(false);
      setPhotoFile(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    }
  };

  if (loading) return <p className="text-center mt-12">Loading profile...</p>;

  if (!user) return <p className="text-center mt-12 text-red-600">Unable to load profile</p>;

  return (
    <div className="profile-container">
      <h2 className="profile-title">
        <FaUserGraduate className="mr-3" />
        My Profile
      </h2>

      <div className="profile-card">
        <div className="profile-avatar">
          {user.photo ? (
            <img src={user.photo} alt="Profile" />
          ) : (
            <div className="avatar-placeholder">
              {user.name?.charAt(0).toUpperCase() || "?"}
            </div>
          )}
        </div>

        <div className="profile-info">
          {isEditing ? (
            <div className="edit-form">
              <label>
                <strong>Name</strong>
                <input type="text" name="name" value={user.name || ""} onChange={handleChange} />
              </label>
              <label>
                <strong>Email</strong>
                <input type="email" name="email" value={user.email || ""} onChange={handleChange} />
              </label>
              <label>
                <strong>Level</strong>
                <input type="text" name="level" value={user.level || ""} onChange={handleChange} placeholder="e.g., Level 200" />
              </label>
              <label >
                <strong>Department</strong>
                <select name="department" value={user.department|| ""} onChange={handleChange} placeholder='Adminstrator'>
                  <option value="select department">Select Department</option>
                 <option value="Computer Engineering">Computer Engineering</option>
              <option value="Laboratory Technician">Laboratory Technician</option>
              <option value="Electric Engineering">Electric Engineering</option>
              <option value="Midwife">Midwife</option>
              <option value="Nursing">Nursing</option>
              <option value="Public Health">Public Health</option>
              <option value="Agricultural Engineering">Agricultural Engineering</option>
                  <option value="Administrator">Administrator</option>
                </select>
              </label>
              <label>
                <strong>Upload Photo</strong>
                <input type="file" accept="image/*" onChange={handlePhotoUpload} />
              </label>

              <div className="edit-actions">
                <button className="save-btn" onClick={handleSave}>Save Changes</button>
                <button className="cancel-btn" onClick={() => setIsEditing(false)}>Cancel</button>
              </div>
            </div>
          ) : (
            <>
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Level:</strong> {user.level || "Not set"}</p>
              <p><strong>Role:</strong> {user.role.charAt(0).toUpperCase() + user.role.slice(1)}</p>
              <p><strong>Department:</strong> {user.department || "Not set"}</p>
              <button className="edit-btn" onClick={() => setIsEditing(true)}>
                <FaEdit className="mr-2" />
                Edit Profile
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;