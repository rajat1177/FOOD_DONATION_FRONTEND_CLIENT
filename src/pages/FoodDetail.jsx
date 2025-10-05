import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FoodDetail = () => {
  const { id } = useParams();
  const [foodItem, setFoodItem] = useState(null);
  const [userRatings, setUserRatings] = useState(0);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userRole, setUserRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showProfileOverlay, setShowProfileOverlay] = useState(false); // State for profile overlay
  const [showRequestOverlay, setShowRequestOverlay] = useState(false); // State for request overlay
  const [donate, setDonate] = useState();
  const [scheduledPickup, setScheduledPickup] = useState(null);
  const [completionDate, setCompletionDate] = useState(null);

  useEffect(() => {
    const fetchFoodItem = async () => {
      try {
        const response = await axios.get(`https://food-donation-backend-xi.vercel.app/api/listings/FoodListings/${id}`, { withCredentials: true });
        const data = response.data;
        const user = data.user;
        const rating = user.rating;
        const name = user.name;
        const email = user.email;
        const role = user.role;

        if (response.status === 200) {
          setFoodItem(data.foodItem);
          setUserRatings(rating);
          setUserName(name);
          setUserEmail(email);
          setUserRole(role);
          toast.success('Food item loaded successfully!');
        } else {
          setFoodItem(null);
        }
      } catch (error) {
        console.error('Error fetching food item:', error);
        setFoodItem(null);
        toast.error('Food item not found!');
      } finally {
        setLoading(false);
      }
    };

    fetchFoodItem();
  }, [id]);

  useEffect(() => {
    const getDonate = async () => {
      try {
        const res = await axios.get(`https://food-donation-backend-xi.vercel.app/api/user/donate/donations/${id}`, { withCredentials: true });
        const data = res.data;
        if (res.status === 200) {
          setDonate(data.donation[0].status);
          setScheduledPickup(data.donation[0].scheduledPickup);
          setCompletionDate(data.donation[0].completionDate);
        } else {
          setDonate(null);
        }
      } catch (error) {
        console.error('Error fetching food item:', error);
        setDonate(null);
      } finally {
        setLoading(false);
      }
    };

    getDonate();
  }, [id]);

  // Request to donation Route
  const handleConfirmRequest = async () => {
    try {
      const requestBody = {
        foodListing: foodItem._id,
      };

      const response = await axios.post(
        'https://food-donation-backend-xi.vercel.app/api/user/donate/donations',
        requestBody,
        { withCredentials: true }
      );

      console.log('Donation request successful:', response.data);
      location.reload()
    } catch (error) {
      if (error.response) {
        console.error('Error response:', error.response.data);
        alert(error.response.data.error || 'Something went wrong while submitting the request.');
      } else {
        console.error('Error:', error.message);
        alert('Unable to process the request. Please try again later.');
      }
    } finally {
      setShowRequestOverlay(false);
    }
  };

  const handleViewProfile = () => {
    // Trigger toast to show profile details
    toast(
      <div className="w-full px-4 py-4">
        <h3 className="text-black text-xl font-bold text-center my-2">USER PROFILE</h3>
        <p>
          <strong>Name:</strong> {userName}
        </p>
        <p>
          <strong>Email:</strong> {userEmail}
        </p>
        <p>
          <strong>Role:</strong> {userRole}
        </p>
        <p>
          <strong>Rating:</strong> {userRatings.toFixed(1)}
        </p>
      </div>,
      {
        position: 'top-center',
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        style: {
          fontSize: '14px',
          padding: '10px',
          width: '90vw', // For mobile responsiveness
          height: 'auto', // Adjust the height as per content
          borderRadius: '20px',
          background: '#ededed',
        },
        className: 'max-w-md w-full', // Ensure the toast doesn't go beyond a max width
      }
    );
    
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen bg-gray-100">Loading...</div>;
  }

  if (!foodItem) {
    return <div className="flex justify-center items-center min-h-screen bg-gray-100">Food item not found</div>;
  }

  return (
    <div className="flex items-center justify-center h-screen w-screen bg-primaryColHover rounded-lg shadow-lg p-4">
      <div className="my-4">
        <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-screen-lg mx-auto">
          {/* Food Image */}
          <div className="flex-shrink-0 mb-6 md:mb-0 md:w-1/2 w-full">
            <img
              src={foodItem.photo || 'https://via.placeholder.com/300'}
              alt={foodItem.title}
              className="w-full h-96 object-cover rounded-xl shadow-lg hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Food Details */}
          <div className="md:ml-8 md:w-2/3 w-full text-headingCol flex flex-col space-y-3">
            <div>
              <h2 className="text-3xl font-bold leading-tight mb-4">{foodItem.title}</h2>
              <p className="text-lg font-light text-headingColHover mb-4">{foodItem.description}</p>
              <div className="space-y-2">
                <p className="text-lg font-medium">
                  Category: <span className="font-light">{foodItem.category}</span>
                </p>
                <p className="text-lg font-medium">
                  Quantity: <span className="font-light">{foodItem.quantity}</span>
                </p>
                <p className="text-lg font-medium">
                  Expires on: <span className="font-light">{new Date(foodItem.expirationDate).toLocaleDateString()}</span>
                </p>
                <p className="text-lg font-medium">
                  Location: <span className="font-light">{foodItem.location.address}</span>
                </p>
              </div>
            </div>
            <div className="flex space-x-2 w-full">
              <div
                onClick={() => setShowRequestOverlay(true)}
                className={`${
                  donate === 'requested'
                    ? 'bg-brown-500 hover:bg-brown-600'
                    : donate === 'accepted'
                    ? 'bg-blue-500 hover:bg-blue-600'
                    : donate === 'scheduled'
                    ? 'bg-yellow-500 hover:bg-yellow-600'
                    : donate === 'completed'
                    ? 'bg-green-500 hover:bg-green-600'
                    : 'bg-gray-500 hover:bg-gray-600'
                } text-green rounded-md py-2 px-6 w-full md:w-auto cursor-pointer transition-all duration-200 transform text-center`}
              >
                {donate === 'requested'
                  ? 'Requested'
                  : donate === 'accepted'
                  ? 'Accepted'
                  : donate === 'scheduled'
                  ? `Scheduled: ${new Date(scheduledPickup).toLocaleDateString()}`
                  : donate === 'completed'
                  ? `Completed: ${new Date(completionDate).toLocaleDateString()}`
                  : 'Request'}
              </div>
              <div
                onClick={handleViewProfile}
                className="bg-green-500 hover:bg-green-600 text-white rounded-md py-2 px-6 w-full md:w-auto cursor-pointer transition-all duration-200 transform text-center"
              >
                View Profile
              </div>
            </div>
          </div>
        </div>

        {/* Request Overlay */}
        {showRequestOverlay &&
          donate !== 'requested' &&
          donate !== 'accepted' &&
          donate !== 'scheduled' &&
          donate !== 'completed' && (
            <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50">
              <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-4xl text-center">
                <h2 className="text-2xl font-semibold mb-4 text-green-600">Request Confirmation</h2>
                <p className="text-lg text-gray-700">
                  Are you sure you want to request this food item? Please confirm your action.
                </p>
                <div className="flex justify-center mt-6 space-x-4">
                  <button
                    onClick={handleConfirmRequest}
                    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-md transition-all duration-200"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => setShowRequestOverlay(false)}
                    className="bg-red-500 hover:bg-red-600 text-white py-2 px-6 rounded-md transition-all duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default FoodDetail;
