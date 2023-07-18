import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import './qc.css';
import CapturePic from './CaptureImage';

const ExcelForm = () => {
  const [formData, setFormData] = useState({
    Survey_Date: '',
    Site_ID: '',
    Ring_Tag:'',
    Attachment_Type: '',
    Cable_Protect: '',
    Cable_Bend: '',
  
    ODF_Inst: '',
    Work_Quality: '',
    Observation: '',    
    Correction_Required: '',
  });

  const [formRows, setFormRows] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);

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
      Survey_Date: '',
      Site_ID: '',
      Ring_Tag: '',
      Attachment_Type: '',
      Cable_Protect: '',
      Cable_Bend: '',
     
      ODF_Inst: '',
      Work_Quality: '',
      Observation: '',    
      Correction_Required: '',
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
      console.log('No data to save');
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(formRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet 1');

    const excelData = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });
    const excelBlob = new Blob([excelData], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    const excelFilename = 'ISP_QC.xlsx';

    saveAs(excelBlob, excelFilename);
  };

  const handleAutoFill = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
        //   const { latitude, longitude } = position.coords;
          const currentDate = new Date().toISOString().split('T')[0];

          setFormData((prevFormData) => ({
            ...prevFormData,
            // Latitude: latitude.toString(),
            // Longitude: longitude.toString(),
            Survey_Date: currentDate,
          }));
        },
        (error) => {
          console.error('Error getting user location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  };

  const handleCancelEdit = () => {
    setSelectedRow(null);
    setFormData({
      Survey_Date: '',
      Site_ID: '',
      Ring_Tag: '',
      Attachment_Type: '',
      Cable_Protect: '',
      Cable_Bend: '',
    
      ODF_Inst: '',
      Work_Quality: '',
      Correction_Required: '',
      Observation: '',
    });
  };

  return (
    <div className="container">
      <h1>ISP QC</h1>
      <form className="survey-form" onSubmit={handleSubmit}>
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
          <label htmlFor="Site_ID">
            <b>Site ID:</b>
          </label>
          <input type="text" id="Site_ID" name="Site_ID" value={formData.Site_ID} onChange={handleInputChange} />
        </div>
        
        <div className="form-group">
          <label htmlFor="Ring_Tag">
            <b>Ring Tag:</b>
          </label>
          <input type="text" id="Ring_Tag" name="Ring_Tag" value={formData.Ring_Tag} onChange={handleInputChange} />
        </div>


        <div className="form-group">
          <label htmlFor="Attachment_Type">
            <b>Attachment Type:</b>
          </label>
          <input type="text" id="Attachment_Type" name="Attachment_Type" value={formData.Attachment_Type} onChange={handleInputChange} />
        </div>

        <div className="form-group">
          <label htmlFor="Cable_Protect">
            <b>Cable Protection:</b>
          </label>
          <input type="text" id="Cable_Protect" name="Cable_Protect" value={formData.Cable_Protect} onChange={handleInputChange} />
        </div>

        <div className="form-group">
          <label htmlFor="Cable_Bend">
            <b>Cable Bend:</b>
          </label>
          <input type="text" id="Cable_Bend" name="Cable_Bend" value={formData.Cable_Bend} onChange={handleInputChange}/>
        </div>

        <div className="form-group">
          <label htmlFor="ODF_Inst">
            <b>ODF Installation:</b>
          </label>
          <input type="text" id="ODF_Inst" name="ODF_Inst" value={formData.ODF_Inst} onChange={handleInputChange}/>
        </div>

        <div className="form-group">
          <label htmlFor="Work_Quality">
            <b>Work_Quality:</b>
          </label>
          <input type="text" id="Work_Quality" name="Work_Quality" value={formData.Work_Quality} onChange={handleInputChange} />
        </div>

        <div className="form-group">
          <label htmlFor="Observation">
            <b>Observation:</b>
          </label>
          <input type="text" id="Observation" name="Observation" value={formData.Observation} onChange={handleInputChange} />
        </div>

        <div className="form-group">
          <label htmlFor="Correction_Required">
            <b>Correction Required:</b>
          </label>
          <input type="text" id="Correction_Required" name="Correction_Required" value={formData.Correction_Required} onChange={handleInputChange} />
        </div>

       

        {/* <div className="button-group">
          <button type="button" onClick={handleAutoFill} className="auto-fill-btn">Auto Fill</button>
          <button type="submit" className="add-row-btn">Add Row</button>
        </div> */}

      <br/>
        <div className="button-group">
          <button type="button" onClick={handleAutoFill} className="auto-fill-btn">
            Auto Fill
          </button>
          {selectedRow !== null ? (
            <>
              <button type="button" onClick={handleCancelEdit} className="cancel-edit-btn">
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
                <th>Survey Date</th>
                <th>Site ID</th>
                <th>Ring Tag</th>
                <th>Attachment Type</th>
                <th>Cable Protect</th>
                <th>Cable Bend</th>
                <th>Work_Quality</th>
                <th>Correction Required</th>
                <th>Observation</th>
                <th>ODF Installation</th>
               
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {formRows.map((row, index) => (
                <tr key={index}>
                  <td>{row.Survey_Date}</td>
                
                  <td>{row.Site_ID}</td>
                  <td>{row.Ring_Tag}</td>
                  <td>{row.Attachment_Type}</td>
                  <td>{row.Cable_Protect}</td>
                  <td>{row.Cable_Bend}</td>
                  <td>{row.Work_Quality}</td>
                  <td>{row.Correction_Required}</td>                 
                  <td>{row.Observation}</td>
                  <td>{row.ODF_Inst}</td>
                  <td>
                    <button type="button" onClick={() => handleEditRow(index)} className="edit-btn">
                      Edit
                    </button>
                    <button type="button" onClick={() => handleDeleteRow(index)} className="delete-btn">
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