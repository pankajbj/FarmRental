import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import AdminService from '../services/AdminService';

/**
 * LandVerificationPanel Component
 * Admin dashboard for verifying farm listings and land deeds
 */
const LandVerificationPanel = () => {
  const [verificationsList, setVerificationsList] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    surveyorName: '',
    verificationNotes: '',
    action: null // 'APPROVE', 'REJECT', 'REQUEST_REUPLOAD'
  });

  // Load pending verifications on mount
  useEffect(() => {
    fetchPendingVerifications();
  }, []);

  // Fetch pending verifications from API
  const fetchPendingVerifications = async () => {
    try {
      setLoading(true);
      const data = await AdminService.getPendingVerifications();
      setVerificationsList(data);
    } catch (error) {
      toast.error('Failed to load pending verifications');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Handle row expansion
  const handleRowClick = (row) => {
    setSelectedRow(row);
    setShowModal(true);
    setFormData({ surveyorName: '', verificationNotes: '', action: null });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.surveyorName || !formData.verificationNotes || !formData.action) {
      toast.error('Please fill all fields and select an action');
      return;
    }

    try {
      const payload = {
        farmId: selectedRow.id,
        surveyorName: formData.surveyorName,
        verificationNotes: formData.verificationNotes,
        isApproved: formData.action === 'APPROVE',
        action: formData.action
      };

      await AdminService.submitVerification(payload);
      toast.success(`Verification ${formData.action.toLowerCase()} submitted successfully`);
      setShowModal(false);
      setSelectedRow(null);
      
      // Refresh the list
      fetchPendingVerifications();
    } catch (error) {
      toast.error('Failed to submit verification');
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Land Deed Verification Dashboard</h1>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-green-700 text-white">
            <tr>
              <th className="px-6 py-4 text-left font-semibold">Farmer Name</th>
              <th className="px-6 py-4 text-left font-semibold">Farm Title</th>
              <th className="px-6 py-4 text-left font-semibold">Survey Number</th>
              <th className="px-6 py-4 text-left font-semibold">Submission Date</th>
              <th className="px-6 py-4 text-center font-semibold">Documents</th>
              <th className="px-6 py-4 text-center font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {verificationsList.map((row, idx) => (
              <tr
                key={row.id}
                onClick={() => handleRowClick(row)}
                className="border-b hover:bg-green-50 cursor-pointer transition-colors"
              >
                <td className="px-6 py-4 text-gray-800">{row.farmerName}</td>
                <td className="px-6 py-4 text-gray-800 font-medium">{row.farmTitle}</td>
                <td className="px-6 py-4 text-gray-600">{row.surveyNumber}</td>
                <td className="px-6 py-4 text-gray-600">{new Date(row.submissionDate).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center gap-2">
                    <a
                      href={row.landDeedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm font-semibold"
                    >
                      Deed
                    </a>
                    <a
                      href={row.soilReportUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm font-semibold"
                    >
                      Soil Report
                    </a>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="px-3 py-1 bg-yellow-200 text-yellow-800 rounded-full text-sm font-semibold">
                    Pending
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Verification Modal */}
      {showModal && selectedRow && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Verification for: {selectedRow.farmTitle}
              </h2>

              <div className="grid grid-cols-2 gap-8 mb-8">
                {/* Left side: Farm details */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Farmer Name</label>
                    <p className="text-gray-800 bg-gray-50 p-3 rounded">{selectedRow.farmerName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Farm Title</label>
                    <p className="text-gray-800 bg-gray-50 p-3 rounded">{selectedRow.farmTitle}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Survey Number</label>
                    <p className="text-gray-800 bg-gray-50 p-3 rounded">{selectedRow.surveyNumber}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Documents</label>
                    <div className="space-y-2">
                      <a
                        href={selectedRow.landDeedUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-blue-600 hover:underline font-semibold"
                      >
                        📄 Land Deed PDF
                      </a>
                      <a
                        href={selectedRow.soilReportUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-blue-600 hover:underline font-semibold"
                      >
                        📊 Soil Quality Report PDF
                      </a>
                    </div>
                  </div>
                </div>

                {/* Right side: Verification form */}
                <form onSubmit={handleSubmit} className="space-y-4 bg-gray-50 p-6 rounded-lg">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Assigned Surveyor Name
                    </label>
                    <input
                      type="text"
                      value={formData.surveyorName}
                      onChange={(e) => setFormData({ ...formData, surveyorName: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                      placeholder="Enter surveyor name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Verification Notes
                    </label>
                    <textarea
                      value={formData.verificationNotes}
                      onChange={(e) => setFormData({ ...formData, verificationNotes: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                      rows="4"
                      placeholder="Enter verification notes..."
                      required
                    />
                  </div>

                  <div className="space-y-2 pt-4">
                    <p className="text-sm font-semibold text-gray-700">Action</p>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, action: 'APPROVE' })}
                      className={`w-full py-2 rounded-lg font-semibold transition-colors ${
                        formData.action === 'APPROVE'
                          ? 'bg-green-600 text-white'
                          : 'bg-green-100 text-green-800 hover:bg-green-200'
                      }`}
                    >
                      ✓ Approve Listing
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, action: 'REJECT' })}
                      className={`w-full py-2 rounded-lg font-semibold transition-colors ${
                        formData.action === 'REJECT'
                          ? 'bg-red-600 text-white'
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                      }`}
                    >
                      ✗ Reject / Fraud Flag
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, action: 'REQUEST_REUPLOAD' })}
                      className={`w-full py-2 rounded-lg font-semibold transition-colors ${
                        formData.action === 'REQUEST_REUPLOAD'
                          ? 'bg-yellow-600 text-white'
                          : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                      }`}
                    >
                      ⟳ Request Re-upload
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-4 bg-green-700 text-white py-3 rounded-lg font-semibold hover:bg-green-800 transition-colors"
                  >
                    Submit Verification
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="w-full bg-gray-300 text-gray-800 py-2 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
                  >
                    Close
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandVerificationPanel;
