
import React, { useState, useContext, useEffect } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  IconButton,
} from "@mui/material";
import { FaUpload, FaEdit, FaTrashAlt } from "react-icons/fa";
import { IoMdAddCircleOutline } from "react-icons/io";
import { AiOutlineEye } from "react-icons/ai";
import { FiDownload } from "react-icons/fi";
import StatusBadge from "./Statuses"; // Make sure you have this component
import Step2 from "./payment";
import { useNavigate } from "react-router-dom";
import { CREATEORUPDATE_ORDER_HISTORY__API } from "../../Constants/apiRoutes";
import LoadingAnimation from "../Loading/LoadingAnimation";
import { IdContext } from "../../Context/IdContex";
import { GETORDERBYID_API } from "../../Constants/apiRoutes";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Combobox } from "@headlessui/react";
import { ChevronUpDownIcon, CheckIcon } from "@heroicons/react/20/solid";
import {
  StyledTableCell,
  StyledTableRow,
  TablePaginationActions,
} from "../CustomTablePagination";
import { AiOutlineEdit } from "react-icons/ai";
import { MdOutlineCancel } from "react-icons/md";

const YourComponent = ({ onBack, onNext }) => {
  // Define state for orders, images, pdfPreview, errors, etc.
  const [formOrderDetails, setFormOrderDetails] = useState({
    OrderStatus: "",
    assginto: "",
    ExpectedDurationDays: "",
    DeliveryDate: "",
    Comments:"",
    UploadDocument:"",
  });
  const [tableOrderDetails, setTableOrderDetails] = useState({
    OrderStatus: "",
    assginto: "",
    ExpectedDurationDays: "",
    DeliveryDate: "",
    Comments:"",
    UploadDocument:"",
  });
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [pdfPreview, setPdfPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [showModal, setShowModal] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  {
    activeStep === 2 && <Step2 />;
  }
  const { generatedId, customerId, orderDate } = useContext(IdContext);
  const [orderStatusList, setOrderStatusList] = useState([]);
  const [orderDetails, setOrderDetails] = useState({
    OrderStatus: "",
    assginto: "",
    ExpectedDurationDays: "",
    DeliveryDate: "",
    StatusID: "",
    Comments:"",
    UploadDocument:"",
  });
  useEffect(() => {
    const fetchOrderStatuses = async () => {
      try {
        const response = await fetch(
          "https://imly-b2y.onrender.com/api/Orderstatus/getAllOrderStatus"
        );
        const data = await response.json();

        // Log the data to see its structure
        console.log("Fetched Order Statuses:", data);

        // Check if data is in the expected format
        if (Array.isArray(data.data)) {
          setOrderStatusList(data.data);
        }
      } catch (error) {
        console.error("Error fetching order statuses:", error);
      }
    };

    fetchOrderStatuses();
  }, []);
  const handleChanging = (e) => {
    const { value } = e.target;

    const selectedStatus = orderStatusList.find(
      (status) => status.StatusID === parseInt(value)
    );

    // Update orderDetails with selected OrderStatus and StatusID
    setOrderDetails({
      OrderStatus: selectedStatus ? selectedStatus.OrderStatus : "",
      StatusID: value, // Store StatusID directly from selection
    });
  };
  const saveOrderHistory = () => {
    // Extract necessary data for validation
    const { StatusID, OrderStatus } = orderDetails;
    const { DeliveryDate,Comments } = formOrderDetails;

    // Validation checks
    if (!StatusID) {
      toast.error("Status is required.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    if (!DeliveryDate) {
      toast.error("Delivery date is required.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    // Continue with saving the order history if validation passes
    const orderHistoryData = {
      TenantID: 1,
      OrderHistoryID: 0,
      OrderID: generatedId,
      StatusID: StatusID || "",
      StartDate: orderDate,
      EndDate: DeliveryDate,
      AssignTo: "2",
      Comments: Comments,
      UserID: 2,
      CreatedBy: "sandy",
      OrderHistoryStatus: OrderStatus || "",
      UploadDocument:formOrderDetails.UploadDocumentpl,
    };

    fetch(CREATEORUPDATE_ORDER_HISTORY__API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderHistoryData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("API Response:", data); // Log the response

        // Check if the response's StatusCode indicates success
        if (data.StatusCode === "SUCCESS") {
          toast.success("Status created successfully!", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });

          // Call fetchOrderDetails to reload the updated data
          fetchOrderDetails();

          closeModalAndMoveToNextStep(); // Close modal and move to next step
        } else {
          // Handle error from the API response
          toast.error(
            data.message || "Error occurred while creating the status.",
            {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            }
          );
          closeModalAfterDelay(); // Close modal after a delay for errors
        }
      })
      .catch((error) => {
        // Handle network or other errors
        toast.error('' + error.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        closeModalAfterDelay(); // Close modal after a delay for errors
      });
  };
  // Close the modal and move to the next step after a delay
  const closeModalAndMoveToNextStep = () => {
    setTimeout(() => {
      setShowModal(false);
      onNext(); // Move to the next step
    }, 8000); // Delay of 4 seconds
  };

  // Close the modal after a delay (for error cases)
  const closeModalAfterDelay = () => {
    setTimeout(() => {
      setShowModal(false); // Close the modal after a delay
    }, 8000); // Delay of 4 seconds
  };

  // Fetch the order details based on the generatedId
  const fetchOrderDetails = async () => {
    try {
      const response = await fetch(`${GETORDERBYID_API}/${generatedId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();
      setTableOrderDetails(data.order); // Update table with fetched order details
    } catch (err) {
      setError(err.message); // Handle fetch error
    } finally {
      setLoading(false); // Stop loading indicator
    }
  };
  // UseEffect hook to refetch order details when `generatedId` changes
  useEffect(() => {
    fetchOrderDetails();
  }, [generatedId]);
   // Dependency on `generatedId`
   const handleEdit = async () => {
    try {
      const response = await fetchOrderDetails(generatedId);
  
      // Log the response to ensure the data is received correctly
      console.log("Fetched Data:", response);
  
  setFormOrderDetails((prevState) => ({
    ...prevState,
    OrderStatus: tableOrderDetails.statusID, // Set 'OrderStatus'
    Comments: tableOrderDetails.Comments || "", // Set 'Comments'
    ExpectedDurationDays: tableOrderDetails.ExpectedDurationDays||"",
    DeliveryDate: tableOrderDetails.DeliveryDate 
    ? new Date(tableOrderDetails.DeliveryDate).toLocaleDateString('en-CA') // For YYYY-MM-DD format
    : "", // Set 'EndDate' to 'DeliveryDate'
  }));
  
  // Debugging: Log to check if OrderStatus is received correctly
  console.log("OrderStatus from response:", response.order.OrderStatus);
    const selectedStatus = orderStatusList.find(
      (status) => status.StatusID === response.order?.OrderStatus
    );
  
  // Set the selected status for the dropdown
  setSelectedStatus(response.order.OrderStatus || "");
  }
  
    catch (error) {
      console.error("Error fetching order details:", error);
    }
  };  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormOrderDetails((prev) => ({ ...prev, [name]: value }));
  };
  const handledate = (e) => {
    const { name, value } = e.target;

    setFormOrderDetails((prevDetails) => {
      const updatedDetails = { ...prevDetails, [name]: value };

      // If ExpectedDurationDays is changed, validate and update DeliveryDate automatically
      if (name === "ExpectedDurationDays") {
        const days = parseInt(value, 10); // Parse the value as an integer

        if (!isNaN(days) && days >= 0) {
          // Only update DeliveryDate if the value is a valid non-negative number
          const today = new Date();
          const deliveryDate = addDays(today, days + 1); // Add 1 extra day for a 5-day gap
          updatedDetails.DeliveryDate = deliveryDate;

          // Clear any previous error
          setErrors((prevErrors) => ({
            ...prevErrors,
            ExpectedDurationDays: "",
          }));
        } else if (value === "") {
          // Clear DeliveryDate if ExpectedDurationDays is cleared
          updatedDetails.DeliveryDate = "";
        } else {
          // Set an error message if the value is not a valid number
          setErrors((prevErrors) => ({
            ...prevErrors,
            ExpectedDurationDays: "Please enter a valid number of days.",
          }));
        }
      }

      return updatedDetails;
    });
  };
  const handleDateChanging = (e) => {
    const { value } = e.target;
    setFormOrderDetails((prevDetails) => ({
      ...prevDetails,
      DeliveryDate: value, // Manually update the DeliveryDate
    }));
  };
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 6) {
      alert("You can only upload up to 6 images.");
      return;
    }
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages([...images, ...newImages]);
    setImagePreviews([
      ...imagePreviews,
      ...newImages.map((img) => img.preview),
    ]);
  };
  const handleImageRemove = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImages(newImages);
    setImagePreviews(newPreviews);
  };
  const handlePdfRemove = () => {
    setPdfFile(null);
    setPdfPreview("");
  };
  const [file, setFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
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
  const addDays = (date, days) => {
    let result = new Date(date);
    result.setDate(result.getDate() + days);
    return result.toISOString().split("T")[0]; // Format as 'YYYY-MM-DD'
  };
  const handleCancel = () => {
    // Example: Reset form or navigate to a different page
    console.log("Cancel clicked");
    // If you want to navigate away from the form, for example:
    navigate("/Orders"); // This assumes you're using `react-router-dom` for navigation
  };
  const [selectedStatus, setSelectedStatus] = useState(
    orderDetails.StatusID || ""
  );
  const [query, setQuery] = useState("");

  const filteredStatusList =
    query === ""
      ? orderStatusList
      : orderStatusList.filter((status) =>
          status.OrderStatus.toLowerCase().includes(query.toLowerCase())
        );

  const handleSelect = (statusID) => {
    setSelectedStatus(statusID);
    handleChanging({ target: { name: "OrderStatus", value: statusID } });
  };

  // Helper function to calculate the duration between two dates
  const calculateDurationDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24)); // Difference in days
    return duration;
  };

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: " 1fr" }, // Ensure proper grid layout
        gap: 2, // Adjust spacing between items
        justifyContent: "center",
        alignItems: "center",
        pt: 2,
      }}
    >
      <>
        <div className="flex flex-col items-center sm:ml-0 lg:ml-50 gap-4">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 w-full">
            <label className="sm:w-1/4 w-full text-left text-xs font-medium text-gray-700">
              Order Status:
            </label>

            <Combobox value={selectedStatus} onChange={handleSelect}>
              <div className="relative w-full sm:w-1/4">
                <Combobox.Input
                  className={`p-1 w-full border rounded-md ${
                    errors.OrderStatus ? "border-red-500" : "border-gray-300"
                  }`}
                  onChange={(e) => setQuery(e.target.value)}
                  displayValue={(statusID) =>
                    orderStatusList.find(
                      (status) => status.StatusID === statusID
                    )?.OrderStatus || ""
                  }
                />
                <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                  <ChevronUpDownIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </Combobox.Button>
                <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto bg-white border border-gray-300 rounded-md shadow-lg">
                  {filteredStatusList.length > 0 ? (
                    filteredStatusList.map((status) => (
                      <Combobox.Option
                        key={status.StatusID}
                        value={status.StatusID}
                        className={({ active }) =>
                          `cursor-pointer select-none relative p-2 ${
                            active ? "bg-blue-500 text-white" : "text-gray-900"
                          }`
                        }
                      >
                        {status.OrderStatus}
                      </Combobox.Option>
                    ))
                  ) : (
                    <div className="p-2 text-gray-500">No found</div>
                  )}
                </Combobox.Options>
              </div>
            </Combobox>

            {errors.OrderStatus && (
              <p className="text-red-500 text-sm ml-2">{errors.OrderStatus}</p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 w-full">
            <label className="sm:w-1/4 w-full text-left text-xs font-medium text-gray-700">
              Comments
            </label>
            <input
              type="text"
              name="Comments"
              value={formOrderDetails.Comments}
              onChange={handleChange}
              className={`p-1 w-full sm:w-1/4 border rounded-md ${
                errors.Comments ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.Comments && (
              <p className="text-red-500 text-sm ml-2">{errors.Comments}</p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 w-full">
            <label className="sm:w-1/4 w-full text-left text-xs font-medium text-gray-700">
              Expected Duration (In Days):
            </label>
            <input
              type="number"
              name="ExpectedDurationDays"
              value={formOrderDetails.ExpectedDurationDays}
              onChange={handledate}
              className={`p-1 w-full sm:w-1/4 border rounded-md ${
                errors.ExpectedDurationDays
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 w-full">
            <label className="sm:w-1/4 w-full text-left text-xs font-medium text-gray-700">
              Delivery Date:
            </label>
            <input
              type="date"
              name="DeliveryDate"
              value={formOrderDetails.DeliveryDate}
              onChange={handleDateChanging}
              className={`p-1 w-full sm:w-1/4 border rounded-md ${
                errors.DeliveryDate ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.DeliveryDate && (
              <p className="text-red-500 text-sm ml-2">{errors.DeliveryDate}</p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 w-full">
            <label className="sm:w-1/4 w-full text-left text-xs font-medium text-gray-700">
              Upload Document:
            </label>
            <input
              type="file"
              multiple
              value={formOrderDetails.UploadDocument}
              accept="image/*,application/pdf,.doc,.docx"
              onChange={handleImageChange}
              className="hidden"
              id="UploadFiles"
            />
            <label
              htmlFor="UploadFiles"
              className="flex items-center justify-center px-4 py-2 p-1 w-full sm:w-1/4 border rounded-md border border-black-500 text-black-500 cursor-pointer hover:bg-blue-50"
            >
              <FaUpload className="mr-2" />
              <span>Upload File</span>
            </label>
          </div>

          {images.length > 0 && (
            <div className="flex items-center mt-2 space-x-2 flex-wrap">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative inline-block">
                  <img
                    src={preview}
                    alt={`Preview ${index}`}
                    className="w-24 h-24 object-cover"
                  />
                  <button
                    onClick={() => handleImageRemove(index)}
                    className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full text-xs"
                  >
                    x
                  </button>
                </div>
              ))}
            </div>
          )}

          {pdfPreview && (
            <div className="mt-2 flex items-center">
              <a
                href={pdfPreview}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                View PDF
              </a>
              <button
                onClick={handlePdfRemove}
                className="ml-4 bg-red-500 text-white p-1 rounded-full text-xs"
              >
                x
              </button>
            </div>
          )}
        </div>

        <div className="relative mt-10 flex justify-end gap-4">
          <div className="mt-6 flex justify-end gap-4">
            <button
              type="submit"
              className="button-base save-btn"
              onClick={() => {
                saveOrderHistory();
                // handleAddOrder();
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
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white rounded-lg p-6 text-center shadow-lg w-11/12 max-w-sm">
                <p className="text-lg">{popupMessage}</p>
              </div>
            </div>
          )}
        </div>

        {orders.length >= 0 && (
          <>
            <TableContainer component={Paper} className="mt-4 shadow-md">
              <Table
                aria-label="orders table"
                className="min-w-full border-collapse border border-gray-300"
              >
                <TableHead className="bg-custom-darkblue">
                  <TableRow>
                    <StyledTableCell
                      align="center"
                      sx={{
                        borderRight: "1px solid #e5e7eb",
                        color: "white",
                        fontWeight: "bold",
                      }}
                    >
                      Order Status
                    </StyledTableCell>
                    <StyledTableCell
                      align="center"
                      sx={{
                        borderRight: "1px solid #e5e7eb",
                        color: "white",
                        fontWeight: "bold",
                      }}
                    >
                      Delivery Date
                    </StyledTableCell>
                    <StyledTableCell
                      align="center"
                      sx={{
                        borderRight: "1px solid #e5e7eb",
                        color: "white",
                        fontWeight: "bold",
                      }}
                    >
                      Comments
                    </StyledTableCell>
                    <StyledTableCell
                      align="center"
                      sx={{
                        borderRight: "1px solid #e5e7eb",
                        color: "white",
                        fontWeight: "bold",
                      }}
                    >
                      Document
                    </StyledTableCell>
                    <StyledTableCell
                      align="center"
                      sx={{
                        borderRight: "1px solid #e5e7eb",
                        color: "white",
                        fontWeight: "bold",
                      }}
                    >
                      Edit
                    </StyledTableCell>
                    <StyledTableCell
                      align="center"
                      sx={{ color: "white", fontWeight: "bold" }}
                    >
                      Delete
                    </StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {!loading && orders ? (
                    <TableRow className="hover:bg-gray-100">
                      {/* Order Status */}
                      <StyledTableCell
                        align="center"
                        className="border-r border-gray-300"
                      >
                        <StatusBadge status={tableOrderDetails.OrderStatus} />
                      </StyledTableCell>

                      {/* Delivery Date */}
                      <StyledTableCell
                        align="center"
                        className="border-r border-gray-300"
                      >
                        {tableOrderDetails.DeliveryDate
                          ? new Date(
                              tableOrderDetails.DeliveryDate
                            ).toLocaleDateString()
                          : "N/A"}
                      </StyledTableCell>

                      {/* Comments */}
                      <StyledTableCell
                        align="center"
                        className="border-r border-gray-300"
                      >
                        {tableOrderDetails.Comments || "N/A"}
                      </StyledTableCell>

                      {/* Document Links */}
                      <StyledTableCell
                        align="center"
                        className="border-r border-gray-300"
                      >
                        {tableOrderDetails.UploadDocument ? (
                          <>
                            <IconButton
                              href={tableOrderDetails.UploadDocument}
                              target="_blank"
                              rel="noopener noreferrer"
                              color="primary"
                            >
                              <AiOutlineEye size={20} />
                              <span className="ml-2 font-bold text-sm">
                                View
                              </span>
                            </IconButton>
                            <IconButton
                              href={tableOrderDetails.UploadDocument}
                              download
                              color="success"
                            >
                              <FiDownload size={20} />
                              <span className="font-bold text-sm">
                                Download
                              </span>
                            </IconButton>
                          </>
                        ) : (
                          "No Documents"
                        )}
                      </StyledTableCell>

                      <StyledTableCell  align="center"
                        className="border-r border-gray-300"                    
                      >
                        <div className="button-container justify-center">
                          <button
                            type="button"
                             onClick={() => handleEdit(generatedId)}
                            className="button edit-button"
                          >
                            <AiOutlineEdit
                              aria-hidden="true"
                              className="h-4 w-4"
                            />
                            Edit
                          </button>
                          </div>
                      </StyledTableCell>
                      <StyledTableCell>
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
                      </StyledTableCell>
                    </TableRow>
                  ) : (
                    <TableRow>
                      <StyledTableCell align="center" colSpan={6}>
                        {loading
                          ? "Loading..."
                          : error
                          ? error
                          : "No Order Found"}
                      </StyledTableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={orders.length}
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

export default YourComponent;
