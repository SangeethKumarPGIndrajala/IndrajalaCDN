import React, { useState } from 'react';
import axios from 'axios';
import './FindUser.css'; // Import custom CSS

const FindUser = ({ token }) => {
    const [input, setInput] = useState('');
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    // Handle input changes for email or phone number input
    const handleInputChange = (e) => {
        setInput(e.target.value);
    };

    // Function to check if the user subscription is active based on expiry date
    const isActiveUser = (expiryDate) => {
        const expiry = new Date(expiryDate);
        const today = new Date();
        return expiry >= today; // Check if expiry date is today or after today
    };

    // Function to search user by email
    const searchByEmail = async () => {
        try {
            const response = await axios.post(
                'https://api.indrajala.in/api/admin/searchUser', 
                { email: input },
                { headers: { 'x-access-protected': token } }
            );

            setResult(response.data);
            setError(null);
        } catch (err) {
            handleError(err);
        }
    };

    // Function to search user by phone number
    const searchByPhoneNumber = async () => {
        try {
            const response = await axios.post(
                'https://api.indrajala.in/api/admin/searchUserByPhone', 
                { phoneNumber: input },
                { headers: { 'x-access-protected': token } }
            );

            setResult(response.data);
            setError(null);
        } catch (err) {
            handleError(err);
        }
    };

    const handleError = (err) => {
        if (err.response && err.response.status === 404) {
            setResult(null);
            setError('No user found with this information.');
        } else {
            setResult(null);
            setError('Error fetching user details. Please check the input or try again later.');
        }
    };

    // Function to update user plan
    const updateUserPlan = async (selection) => {
        if (!result || !result.email) {
            setError('No user details available for updating.');
            return;
        }
        try {
            const response = await axios.post(
                'https://api.indrajala.in/api/admin/upDateUser',
                {
                    email: result.email,
                    selection: selection,
                },
                {
                    headers: {
                        'x-access-protected': token
                    }
                }
            );
            setSuccessMessage(`User plan updated to ${selection} successfully.`);
            setError(null);
        } catch (err) {
            setSuccessMessage(null);
            setError('Error updating user plan. Please try again.');
        }
    };

    return (
        <div className="find-user-container">
            <h2>Find User</h2>
            <input
                type="text"
                placeholder="Enter Email or Phone Number"
                value={input}
                onChange={handleInputChange}
                className="input-field"
            />
            <div className="button-container">
                <button onClick={searchByEmail} className="search-button">Search by Email</button>
                <button onClick={searchByPhoneNumber} className="search-button">Search by Phone Number</button>
            </div>
            {error && <p className="error-message">{error}</p>}
            {successMessage && <p className="success-message">{successMessage}</p>}
            {result && (
                <div className="user-details">
                    <h3>User Details:</h3>
                    <p><strong>Name:</strong> {result.name}</p>
                    <p><strong>Email:</strong> {result.email}</p>
                    <p><strong>Phone Number:</strong> {result.phoneNumber}</p>
                    <p><strong>Subscription Type:</strong> {result.subscriptionType}</p>
                    <p><strong>Expiry Date:</strong> {new Date(result.expiryDate).toLocaleDateString()}</p>
                    <p><strong>Status:</strong> {isActiveUser(result.expiryDate) ? 'Active User' : 'Expired User'}</p>
                    <div className="update-buttons">
                        <button className="update-button" onClick={() => updateUserPlan('A')}>Update to Basic Plan</button>
                        <button className="update-button" onClick={() => updateUserPlan('B')}>Update to Golden Plan</button>
                        <button className="update-button" onClick={() => updateUserPlan('C')}>Update to Standard Plan</button>
                        <button className="update-button" onClick={() => updateUserPlan('D')}>Update to Premium Plan</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FindUser;
