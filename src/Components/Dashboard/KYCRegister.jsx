import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import Loader from '../UI/Loader';
import axios from 'axios';
import { toast } from 'react-toastify';

const KYCRegister = () => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    documentType: 'passport',
    documentNumber: '',
    documentImage: null,
  });
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, documentImage: file }));
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      // Step 1: Create applicant (no need to store response)
      await axios.post('/api/kyc/create-applicant');

      // Step 2: Submit document
      const formDataToSend = new FormData();
      formDataToSend.append('documentType', formData.documentType);
      formDataToSend.append('documentNumber', formData.documentNumber);
      formDataToSend.append('documentImage', formData.documentImage);

      // We don't need to store the document response either
      await axios.post('/api/kyc/add-document', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      }); 

      setMessage('KYC document submitted successfully for verification');
      toast.success('KYC submitted successfully!');

      // Reset form
      setFormData({
        documentType: 'passport',
        documentNumber: '',
        documentImage: null,
      });
      setPreview('');
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || 'KYC submission failed';
      setError(errorMsg);
      toast.error(`Error: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-[#252E75] mb-4">
          KYC Registration
        </h3>
        {message && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
            {message}
          </div>
        )}
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ... existing form fields ... */}
          <div>
            <label
              htmlFor="documentType"
              className="block text-sm font-medium text-[#252E75]"
            >
              Document Type
            </label>
            <select
              id="documentType"
              name="documentType"
              value={formData.documentType}
              onChange={handleChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-[#25C866] focus:outline-none focus:ring-[#25C866] focus:border-[#25C866] sm:text-sm rounded-md"
            >
              <option value="passport">Passport</option>
              <option value="id-card">National ID Card</option>
              <option value="driver-license">Driver's License</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="documentNumber"
              className="block text-sm font-medium text-[#252E75]"
            >
              Document Number
            </label>
            <input
              type="text"
              id="documentNumber"
              name="documentNumber"
              value={formData.documentNumber}
              onChange={handleChange}
              className="mt-1 block w-full border border-[#25C866] rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#25C866] focus:border-[#25C866]"
              required
            />
          </div>
          <div>
            <label
              htmlFor="documentImage"
              className="block text-sm font-medium text-[#252E75]"
            >
              Document Image
            </label>
            <div className="mt-1 flex items-center">
              <input
                type="file"
                id="documentImage"
                name="documentImage"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-secondary-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                required
              />
            </div>
            {preview && (
              <div className="mt-2">
                <p className="text-sm text-secondary-500 mb-1">Preview:</p>
                <img
                  src={preview}
                  alt="Document preview"
                  className="h-32 object-contain border border-secondary-200 rounded"
                />
              </div>
            )}
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#25C866] hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#25C866] transition-colors"
            >
              {loading ? <Loader size="small" /> : 'Submit KYC'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default KYCRegister;
