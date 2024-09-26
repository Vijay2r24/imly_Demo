import React, { useState, useContext, useEffect } from 'react';
import { Box, Button, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Paper } from '@mui/material';
import { IoMdAddCircleOutline } from 'react-icons/io';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import StatusBadge from './Statuses';
// Import StatusBadge component if it's a separate file
import { useNavigate } from 'react-router-dom';
import { CREATEORUPDATE_PAYMENT_API, GET_PAYMENTSBY_ORDERID_API } from "../../Constants/apiRoutes";
import { IdContext } from '../../Context/IdContex';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Combobox } from '@headlessui/react';
import { ChevronUpDownIcon, CheckIcon } from "@heroicons/react/20/solid";
import { MdOutlineCancel } from "react-icons/md";
import { AiOutlineEdit } from "react-icons/ai";




const Payment = () => {
  const { generatedId, customerId, orderDate } = useContext(IdContext);
  const [orderDetails, setOrderDetails] = useState({
    PaymentMethod: '',
    PaymentStatus: '',
    MaskedCardNumber: '',
    PaymentComments: '',
    AdvanceAmount: ''
  });

  const [errors, setErrors] = useState({});
  const [orders1, setOrders1] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [file, setFile] = useState(null);
  const [popupMessage, setPopupMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false); // Initialize editMode to false

  const savePayment = () => {
    // Validation messages
    const validatePaymentData = () => {
      if (!orderDetails.AdvanceAmount) return 'Advance amount is required.';
      if (!orderDetails.PaymentMethod) return 'Payment method is required.';
      if (!orderDetails.PaymentStatus) return 'Payment status is required.';
      if (!orderDetails.MaskedCardNumber) return 'Masked card number is required.';
      if (!orderDetails.PaymentComments) return 'Payment comments are required.';
      return null; // No errors
    };
  
    // Call validation function
    const validationError = validatePaymentData();
  
    // If validation fails, show an error toast and exit the function
    if (validationError) {
      toast.error(validationError, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return; // Exit function if validation fails
    }
  
    // Payment data object
    const paymentData = {
      TenantID: 1,
      PaymentID: 0,
      OrderID: generatedId,
      CustomerID: 33,
      TotalAmount: orderDetails.AdvanceAmount,
      AdvanceAmount: 500,
      BalanceAmount: 500, // Corrected typo
      PaymentComments: orderDetails.PaymentComments,
      PaymentMethod: orderDetails.PaymentMethod,
      PaymentStatus: orderDetails.PaymentStatus,
      MaskedCardNumber: orderDetails.MaskedCardNumber,
    };
  
    // Proceed with the fetch request if validation passes
    fetch(CREATEORUPDATE_PAYMENT_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    })
      .then(response => response.json())
      .then(data => {
        console.log('API Response:', data); // Log the response
  
        // Check if the response's StatusCode indicates success
        if (data.StatusCode === "SUCCESS") {
          toast.success('Payment created successfully!', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
  
          // Call fetchOrderDetails after a successful payment
          fetchOrderDetails(); // This will refresh the payment details
  
          // Reset the orderDetails state here
          setOrderDetails({
            AdvanceAmount: '',
            PaymentMethod: '',
            PaymentStatus: '',
            MaskedCardNumber: '',
            PaymentComments: '',
          });
        } else {
          // Handle error from the API response
          toast.error(data.message || 'Error occurred while creating the Payment.', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      })
      .catch(error => {
        // Handle network or other errors
        toast.error('❌ ' + error.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });
  };

  // Function to fetch order details

  // Initial fetch when component loads
  useEffect(() => {
    fetchOrderDetails();
  }, [generatedId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrderDetails({ ...orderDetails, [name]: value });
  };
  const handleDelete = () => {
    setFile(null);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleCancel = () => {
    // Example: Reset form or navigate to a different page
    console.log('Cancel clicked');
    // If you want to navigate away from the form, for example:
    navigate('/Orders');  // This assumes you're using `react-router-dom` for navigation
  };

  const [activeStep, setActiveStep] = useState(0);
  const [paymentDetails, setPaymentDetails] = useState([]);
  const fetchOrderDetails = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${GET_PAYMENTSBY_ORDERID_API}/${generatedId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const result = await response.json();
      console.log("API Response:", result); // Log the entire response
      
      const payments = result.data || [];
      const paymentDetails = payments.map((payment) => ({
        PaymentID: payment.PaymentID || "",
        PaymentMethod: payment.PaymentMethod || "N/A",
        PaymentStatus: payment.PaymentStatus || "N/A",
        MaskedCardNumber: payment.MaskedCardNumber || "N/A",
        PaymentComments: payment.PaymentComments || "N/A",
        TotalAmount: payment.TotalAmount || "N/A",
        AdvanceAmount: payment.AdvanceAmount || "N/A",
        BalanceAmount: payment.BalanceAmount || "N/A",
        PaymentDate: payment.PaymentDate || "N/A",
      }));

      console.log("Mapped Payment Details:", paymentDetails); // Log payment details
      setPaymentDetails(paymentDetails);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, [generatedId]);

  const handleEditPayment = (paymentId) => {
    console.log("Attempting to edit PaymentID:", paymentId);
    console.log("Available PaymentIDs:", paymentDetails.map(payment => payment.PaymentID));

    const paymentData = paymentDetails.find(payment => payment.PaymentID === paymentId);
    if (paymentData) {
      setOrderDetails({
        PaymentID: paymentData.PaymentID || "",
        PaymentStatus: paymentData.PaymentStatus || "",
        PaymentMethod: paymentData.PaymentMethod || "",
        MaskedCardNumber: paymentData.MaskedCardNumber || "",
        AdvanceAmount: paymentData.AdvanceAmount || "",
        BalanceAmount: paymentData.BalanceAmount || "",
        TotalAmount: paymentData.TotalAmount || "",
        PaymentComments: paymentData.PaymentComments || "",
      });
      setEditMode(true);
    } else {
      console.error("No valid data found for the provided PaymentID:", paymentId);
    }
  };
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "1fr " }, // Ensure proper grid layout
        gap: 2, // Adjust spacing between items
        pt: 2,
      }}
    >
      <>
        <div className="flex justify-center flex-col sm:flex-row gap-2 sm:gap-0">
          <label className="w-full sm:w-1/4 text-xs font-medium text-gray-700">
            Payment Type:
          </label>
          <Combobox value={orderDetails.PaymentMethod} onChange={(value) => handleChange({ target: { name: 'PaymentMethod', value } })}>
            <div className="relative w-full sm:w-1/4">
              <Combobox.Input
                className={`p-1 w-full border rounded-md ${errors.PaymentMethod ? 'border-red-500' : 'border-gray-300'}`}
                displayValue={(option) => option || 'Select a Type'}
              />
              <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                <ChevronUpDownIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </Combobox.Button>
              <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {['Cash', 'UPI', 'Card'].map((method) => (
                  <Combobox.Option
                    key={method}
                    value={method}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-blue-600 text-white' : 'text-gray-900'
                      }`
                    }
                  >
                    {method}
                  </Combobox.Option>
                ))}
              </Combobox.Options>
            </div>
          </Combobox>
          {errors.PaymentMethod && (
            <p className="text-red-500 text-sm mt-1 sm:ml-4">
              {errors.PaymentMethod}
            </p>
          )}
        </div>
        <div className="flex justify-center flex-col sm:flex-row gap-2 sm:gap-0">
          <label className="text-left w-full sm:w-1/4 text-xs font-medium text-gray-700">
            Payment Status:
          </label>
          <Combobox value={orderDetails.PaymentStatus} onChange={(value) => handleChange({ target: { name: 'PaymentStatus', value } })}>
            <div className="relative w-full sm:w-1/4">
              <Combobox.Input
                className={`p-1 w-full border rounded-md ${errors.PaymentStatus ? 'border-red-500' : 'border-gray-300'}`}
                displayValue={(option) => option || 'Select a Status'}
              />
              <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                  <ChevronUpDownIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </Combobox.Button>
              </Combobox.Button>
              <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {['Processing', 'Pending', 'Completed'].map((status) => (
                  <Combobox.Option
                    key={status}
                    value={status}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-blue-600 text-white' : 'text-gray-900'
                      }`
                    }
                  >
                    {status}
                  </Combobox.Option>
                ))}
              </Combobox.Options>
            </div>
          </Combobox>
          {errors.PaymentStatus && (
            <p className="text-red-500 text-sm mt-1 sm:ml-4">
              {errors.PaymentStatus}
            </p>
          )}
        </div>
        <div className="flex  justify-center flex-col sm:flex-row gap-2 sm:gap-0">
          <label className="text-xs w-full sm:w-1/4 text-left font-medium text-gray-700">
            Payments Card Number:
          </label>
          <input
            type="text"
            name="MaskedCardNumber"
            value={
              orderDetails.MaskedCardNumber
                ? orderDetails.MaskedCardNumber.replace(/\d(?=\d{4})/g, "*")
                : ""
            }
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, ""); // Remove non-digit characters
              if (value.length <= 16) {
                handleChange({
                  target: { name: "MaskedCardNumber", value },
                });
              }
            }}
            className={`p-1 w-full sm:w-1/4 border rounded-md ${errors.MaskedCardNumber ? "border-red-500" : "border-gray-300"}`}
          />
          {errors.MaskedCardNumber && (
            <p className="text-red-500 text-sm mt-1 sm:ml-4">
              {errors.MaskedCardNumber}
            </p>
          )}
        </div>

        <div className="flex   justify-center flex-col sm:flex-row gap-2 sm:gap-0">
          <label className="text-xs w-full sm:w-1/4 text-left font-medium text-gray-700">
            Payment Comments:
          </label>
          <input
            type="text"
            name="PaymentComments"
            value={orderDetails.PaymentComments}
            onChange={handleChange}
            className={`p-1 w-full sm:w-1/4 border rounded-md ${errors.PaymentComments ? "border-red-500" : "border-gray-300"}`}
          />
          {errors.PaymentComments && (
            <p className="text-red-500 text-sm mt-1 sm:ml-4">
              {errors.PaymentComments}
            </p>
          )}
        </div>

        <div className="flex justify-center flex-col sm:flex-row gap-2 sm:gap-0">
          <label className="text-xs w-full sm:w-1/4 text-left font-medium text-gray-700">
            Amount:
          </label>
          <input
            type="number"
            name="AdvanceAmount"
            value={orderDetails.AdvanceAmount}
            onChange={handleChange}
            className={`p-1 w-full sm:w-1/4 border rounded-md ${errors.AdvanceAmount ? "border-red-500" : "border-gray-300"}`}
          />
          {errors.AdvanceAmount && (
            <p className="text-red-500 text-sm mt-1 sm:ml-4">
              {errors.AdvanceAmount}
            </p>
          )}
        </div>
        <div className="relative mt-10 flex justify-end gap-4">
          <div className="mt-6 flex justify-end gap-4">
            <button
              type="submit"
              className="button-base save-btn"
              onClick={() => {
                savePayment();
              }}
            >
              Save
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="button-base cancel-btn"
            >
              Cancel
            </button>

          </div>
          {showModal && (
            <div className="fixed ml-10 inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-4 rounded shadow-lg">
                <h2 className="text-lg font-semibold">{popupMessage}</h2>
              </div>
            </div>
          )}
        </div>

        {orders1.length >= 0 && (
          <>
            <TableContainer component={Paper} className="mt-4 shadow-md">
              <Table className="min-w-full border-collapse border border-gray-300">
                <TableHead className="bg-custom-darkblue text-white">
                  <TableRow>
                    <TableCell align="center" sx={{ borderRight: '1px solid #e5e7eb', color: 'white', fontWeight: 'bold' }}>Payment Type</TableCell>
                    <TableCell align="center" sx={{ borderRight: '1px solid #e5e7eb', color: 'white', fontWeight: 'bold' }}>Payment Status</TableCell>
                    <TableCell align="center" sx={{ borderRight: '1px solid #e5e7eb', color: 'white', fontWeight: 'bold' }}>Payment Card Number</TableCell>
                    <TableCell align="center" sx={{ borderRight: '1px solid #e5e7eb', color: 'white', fontWeight: 'bold' }}>Payment Comments</TableCell>
                    <TableCell align="center" sx={{ borderRight: '1px solid #e5e7eb', color: 'white', fontWeight: 'bold' }}>Edit</TableCell>
                    <TableCell align="center" sx={{ borderRight: '1px solid #e5e7eb', color: 'white', fontWeight: 'bold' }}>Delete</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paymentDetails.map((payment, index) => (
                    <TableRow key={index} className="text-center border-b border-gray-300 hover:bg-gray-100">
                      {/* Payment Method */}
                      <TableCell align="center" className="border-r">{payment.PaymentMethod}</TableCell>

                      {/* Payment Status with Badge */}
                      <TableCell align="center" className="border-r border-gray-300">
                        <StatusBadge status={payment.PaymentStatus} />
                      </TableCell>

                      {/* Masked Card Number */}
                      <TableCell align="center" className="border-r border-gray-300">{payment.MaskedCardNumber}</TableCell>

                      {/* Payment Comments */}
                      <TableCell align="center" className="border-r">{payment.PaymentComments}</TableCell>

                      {/* Edit Button */}
                      <TableCell align="center" className="border-r border-gray-300">
                      <button
                            type="button"
                            onClick={() => handleEditPayment(payment.PaymentID)}
                            className="button edit-button"
                          >
                            <AiOutlineEdit
                              aria-hidden="true"
                              className="h-4 w-4"
                            />
                            Edit
                          </button>
                      </TableCell>

                      {/* Delete Button */}
                      <TableCell align="center">
                      <div className="button-container justify-center">
                          <button
                            type="button"
                            // onClick={() => handleDelete(generatedId)}
                            className="button delete-button"
                          >
                            <MdOutlineCancel
                              aria-hidden="true"
                              className="h-4 w-4"
                            />
                            Delete
                          </button>
                        </div>
                        </TableCell>
                    </TableRow>
                  ))}
                </TableBody>

              </Table>
            </TableContainer>

            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={orders1.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )}
      </>
    </Box>
  );
};

export default Payment;