import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import "./qc.css";
import { format } from "date-fns";
import CapturePic from "./CaptureImage";

const ExcelForm = () => {
  const [formData, setFormData] = useState({
    No_of_Pit: "",
    Survey_Date: "",
    Ring_Tag: "",
    Section_Name: "",
    Trench_Depth_Ft: "",
    Latitude: "",
    Longitude: "",
    Trench_Alignment: "",
    Observations: "",
    Correction_Required: "",
    Correction_Length: "",
    Trench_Distance: "",
  });

  const [formRows, setFormRows] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [deptMaintained, setDeptMaintained] = useState("Dept maintained");

  useEffect(() => {
    if (selectedRow !== null) {
      setFormData(formRows[selectedRow]);
    }
  }, [selectedRow, formRows]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (selectedRow !== null) {
      // Update the selected row
      setFormRows((prevFormRows) => {
        const updatedRows = [...prevFormRows];
        updatedRows[selectedRow] = { ...formData };
        return updatedRows;
      });
      setSelectedRow(null);
    } else {
      // Add the current form data as a new row to the formRows array
      setFormRows((prevFormRows) => [...prevFormRows, { ...formData }]);
    }

    // Reset the form fields
    setFormData({
      No_of_Pit: "",
      Survey_Date: "",
      Ring_Tag: "",
      Section_Name: "",
      Trench_Depth_Ft: "",
      Latitude: "",
      Longitude: "",
      Trench_Alignment: "",
      Observations: "",
      Correction_Required: "",
      Correction_Length: "",
      Trench_Distance: "",
    });
  };

  const handleEditRow = (index) => {
    setSelectedRow(index);
  };

  const handleDeleteRow = (index) => {
    setFormRows((prevFormRows) => {
      const updatedRows = [...prevFormRows];
      updatedRows.splice(index, 1);
      return updatedRows;
    });

    if (selectedRow === index) {
      setSelectedRow(null);
    }
  };

  const handleSaveExcel = () => {
    if (formRows.length === 0) {
      console.log("No data to save");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(formRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet 1");

    const excelData = XLSX.write(workbook, { type: "array", bookType: "xlsx" });
    const excelBlob = new Blob([excelData], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const excelFilename = "OSP_QC.xlsx";

    saveAs(excelBlob, excelFilename);
  };

  const handleAutoFill = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // const currentDate = new Date().toISOString().split('T')[0];
          const currentDate = new Date();

          // Format the date as 'DD-MM-YYYY'
          const formattedDate = currentDate.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          });

          setFormData((prevFormData) => ({
            ...prevFormData,
            Latitude: latitude.toString(),
            Longitude: longitude.toString(),
            // Survey_Date: currentDate,
            Survey_Date: formattedDate,
          }));
        },
        (error) => {
          console.error("Error getting user location:", error);
        },
        {
          enableHighAccuracy: true, // Request higher accuracy for location
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  const handleCancelEdit = () => {
    setSelectedRow(null);
    setFormData({
      No_of_Pit: "",
      Survey_Date: "",
      Ring_Tag: "",
      Section_Name: "",
      Trench_Depth_Ft: "",
      Latitude: "",
      Longitude: "",
      Trench_Alignment: "",
      Observations: "",
      Correction_Required: "",
      Correction_Length: "",
      Trench_Distance: "",
    });
  };

  return (
    <div className="container">
      <h1>OSP QC</h1>
      <form className="survey-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="No_of_Pit">
            <b>NO of Pits:</b>
          </label>
          <input
            type="text"
            id="No_of_Pit"
            name="No_of_Pit"
            value={formData.No_of_Pit}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="Survey_Date">
            <b>Survey Date:</b>
          </label>
          <input
            type="date"
            id="Survey_Date"
            name="Survey_Date"
            value={formData.Survey_Date}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="Ring_Tag">
            <b>Ring Tag:</b>
          </label>
          <input
            type="text"
            id="Ring_Tag"
            name="Ring_Tag"
            value={formData.Ring_Tag}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="Section_Name">
            <b>Section Name:</b>
          </label>
          <input
            type="text"
            id="Section_Name"
            name="Section_Name"
            value={formData.Section_Name}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="Trench_Depth_Ft">
            <b>Trench Depth (Ft):</b>
          </label>
          <input
            type="text"
            id="Trench_Depth_Ft"
            name="Trench_Depth_Ft"
            value={formData.Trench_Depth_Ft}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label htmlFor="Latitude">
            <b>Latitude:</b>
          </label>
          <input
            type="text"
            id="Latitude"
            name="Latitude"
            value={formData.Latitude}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="Longitude">
            <b>Longitude:</b>
          </label>
          <input
            type="text"
            id="Longitude"
            name="Longitude"
            value={formData.Longitude}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="Trench_Alignment">
            <b>Trench Alignment:</b>
          </label>
          <input
            type="text"
            id="Trench_Alignment"
            name="Trench_Alignment"
            value={formData.Trench_Alignment}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="Observations">
            <b>Observations:</b>
          </label>
          <input
            type="text"
            id="Observations"
            name="Observations"
            value={formData.Observations}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="Correction_Required">
            <b>Correction Required:</b>
          </label>
          <input
            type="text"
            id="Correction_Required"
            name="Correction_Required"
            value={formData.Correction_Required}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="Correction_Length">
            <b>Correction Length (M):</b>
          </label>
          <input
            type="text"
            id="Correction_Length"
            name="Correction_Length"
            value={formData.Correction_Length}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label htmlFor="Trench_Distance">
            <b>Trench Distance (Ft):</b>
          </label>
          <input
            type="text"
            id="Trench_Distance"
            name="Trench_Distance"
            value={formData.Trench_Distance}
            onChange={handleInputChange}
          />
        </div>

        <br />
        <div className="button-group">
          <button
            type="button"
            onClick={handleAutoFill}
            className="auto-fill-btn"
          >
            Auto Fill
          </button>
          {selectedRow !== null ? (
            <>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="cancel-edit-btn"
              >
                Cancel Edit
              </button>
              <button type="submit" className="update-row-btn">
                Update Row
              </button>
            </>
          ) : (
            <button type="submit" className="add-row-btn">
              Add Row
            </button>
          )}
        </div>
      </form>

      {formRows.length > 0 && (
        <div>
          <h2>Form Data Rows:</h2>
          <table className="data-table">
            <thead>
              <tr>
                <th>No of Pits</th>
                <th>Survey Date</th>
                <th>Ring Tag</th>
                <th>Section Name</th>
                <th>Trench Depth (Ft)</th>
                <th>Latitude</th>
                <th>Longitude</th>
                <th>Trench Alignment</th>
                <th>Observations</th>
                <th>Correction Required</th>
                <th>Correction length (M)</th>
                <th>Trench Distance (Ft)</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {formRows.map((row, index) => (
                <tr key={index}>
                  <td>{row.No_of_Pit}</td>
                  <td>{row.Survey_Date}</td>
                  <td>{row.Ring_Tag}</td>
                  <td>{row.Section_Name}</td>
                  <td>{row.Trench_Depth_Ft}</td>
                  <td>{row.Latitude}</td>
                  <td>{row.Longitude}</td>
                  <td>{row.Trench_Alignment}</td>
                  <td>{row.Observations}</td>
                  <td>{row.Correction_Required}</td>
                  <td>{row.Correction_Length}</td>
                  <td>{row.Trench_Distance}</td>
                  <td>
                    <button
                      type="button"
                      onClick={() => handleEditRow(index)}
                      className="edit-btn"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteRow(index)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={handleSaveExcel} className="save-excel-btn">
            Save as Excel
          </button>
        </div>
      )}
    </div>
  );
};

export default ExcelForm;
