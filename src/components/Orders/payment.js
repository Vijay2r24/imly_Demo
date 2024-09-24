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
  const savePayment = () => {
    const paymentData = {
      TenantID: 1,
      PaymentID: 0,
      OrderID: generatedId,
      CustomerID: 33,
      TotalAmount: orderDetails.AdvanceAmount,
      AdvanceAmount: 500,
      BalenceAmount: 500, // Check this typo, it should be "BalanceAmount"
      PaymentComments: orderDetails.PaymentComments,
      PaymentMethod: orderDetails.PaymentMethod,
      PaymentStatus: orderDetails.PaymentStatus,
      MaskedCardNumber: orderDetails.MaskedCardNumber,
    };
  
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
          fetchOrderDetails();  // This will refresh the payment details
  
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
  const fetchOrderDetails = async () => {
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
      const payments = result.data; // Assuming 'data' is the array of payment objects
  
      // Assuming you want to map the payment data to match your state structure
      const paymentDetails = payments.map((payment) => ({
        PaymentMethod: payment.PaymentMethod || "N/A",
        PaymentStatus: payment.PaymentStatus || "N/A",
        MaskedCardNumber: payment.MaskedCardNumber || "N/A",
        PaymentComments: payment.PaymentComments || "N/A",
        TotalAmount: payment.TotalAmount || "N/A",
        AdvanceAmount: payment.AdvanceAmount || "N/A",
        BalanceAmount: payment.BalenceAmount || "N/A", // Fixing typo to 'BalanceAmount'
        PaymentDate: payment.PaymentDate || "N/A",
      }));
  
      setPaymentDetails(paymentDetails); // Updating state with mapped payment details
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Initial fetch when component loads
  useEffect(() => {
    fetchOrderDetails();
  }, [generatedId]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrderDetails({ ...orderDetails, [name]: value });
  };

  const handleAddOrderes = () => {
    const newErrors = {};
    if (!orderDetails.PaymentMethod)
      newErrors.PaymentMethod = "PaymentMethod is required";
    if (!orderDetails.PaymentStatus)
      newErrors.PaymentStatus = "PaymentStatus is required";
    if (!orderDetails.MaskedCardNumber)
      newErrors.MaskedCardNumber = "MaskedCardNumber Type is required";
    if (!orderDetails.PaymentComments)
      newErrors.PaymentComments = "PaymentComments  is required";
    if (!orderDetails.AdvanceAmount)
      newErrors.AdvanceAmount = "Amount is required";
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      // Add the order to the orders array
      setOrders1([...orders1, orderDetails]);

      // Clear the form fields
      setOrderDetails({
        PaymentMethod: "",
        PaymentStatus: "",
        MaskedCardNumber: "",
        PaymentComments: "",
        AdvanceAmount: "",
      });
    }
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


  // useEffect(() => {
  //   const fetchOrderDetails = async () => {
  //     try {
  //       const response = await fetch(`${GET_PAYMENTSBY_ORDERID_API}/${generatedId}`, {
  //         method: 'GET',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //       });
  
  //       if (!response.ok) {
  //         throw new Error('Failed to fetch data');
  //       }
  
  //       const result = await response.json();
  //       const payments = result.data; // Assuming 'data' is the array of payment objects
  
  //       // Assuming you want to map the payment data to match your state structure
  //       const paymentDetails = payments.map((payment) => ({
  //         PaymentMethod: payment.PaymentMethod || "N/A",
  //         PaymentStatus: payment.PaymentStatus || "N/A",
  //         MaskedCardNumber: payment.MaskedCardNumber || "N/A",
  //         PaymentComments: payment.PaymentComments || "N/A",
  //         TotalAmount: payment.TotalAmount || "N/A",
  //         AdvanceAmount: payment.AdvanceAmount || "N/A",
  //         BalanceAmount: payment.BalenceAmount || "N/A", // Fixing typo to 'BalanceAmount'
  //         PaymentDate: payment.PaymentDate || "N/A",
  //       }));
  
  //       setPaymentDetails(paymentDetails); // Updating state with mapped payment details
  
  //     } catch (err) {
  //       setError(err.message);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  
  //   fetchOrderDetails();
  // }, [generatedId]); 

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
        <div className="flex  justify-center flex-col sm:flex-row gap-2 sm:gap-0">
          <label className="w-full sm:w-1/4 text-xs font-medium text-gray-700">
            Payments Type:
          </label>
          <select
            name="PaymentMethod"
            value={orderDetails.PaymentMethod}
            onChange={handleChange}
            className={`p-1 w-full sm:w-1/4 border rounded-md ${errors.PaymentMethod ? "border-red-500" : "border-gray-300"}`}
          >
            <option value="select a type ">Select a Type</option>
            <option value="Cash">Cash</option>
            <option value="UPI">UPI</option>
            <option value="Card">Card</option>
          </select>
          {errors.PaymentMethod && (
            <p className="text-red-500 text-sm mt-1 sm:ml-4">
              {errors.PaymentMethod}
            </p>
          )}
        </div>

        <div className="flex  justify-center flex-col sm:flex-row gap-2 sm:gap-0">
          <label className="text-left w-full sm:w-1/4 text-xs font-medium text-gray-700">
            Payment Status:
          </label>
          <select
            name="PaymentStatus"
            value={orderDetails.PaymentStatus}
            onChange={handleChange}
            className={`p-1 w-full sm:w-1/4 border rounded-md ${errors.PaymentStatus ? "border-red-500" : "border-gray-300"}`}
          >
            <option value="select a type">Select a Status</option>
            <option value="Processing">Processing</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
          </select>
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
                handleAddOrderes();
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
                        <IconButton onClick={''} color="primary">
                          <FaEdit size={20} />
                        </IconButton>
                      </TableCell>

                      {/* Delete Button */}
                      <TableCell align="center">
                        <IconButton onClick={''} color="error">
                          <FaTrashAlt size={20} />
                        </IconButton>
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