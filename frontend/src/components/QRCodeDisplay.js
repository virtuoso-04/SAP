import React from 'react';

const QRCodeDisplay = ({ qrDataUrl, registrationId, attendeeName }) => {
  // Function to download QR code as image
  const handleDownloadQR = () => {
    // Create temporary link
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `EventMate_QR_${registrationId}.png`;
    
    // Add to document, trigger click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col items-center text-center">
      <div className="border-4 border-white rounded-sap shadow-lg p-3 bg-white mb-4">
        <img 
          src={qrDataUrl} 
          alt={`Registration QR code for ${attendeeName}`}
          className="w-64 h-64"
        />
      </div>
      
      <p className="text-lg font-medium mb-1">{attendeeName}</p>
      <p className="text-sap-blue font-bold text-xl mb-3">{registrationId}</p>
      
      <button
        onClick={handleDownloadQR}
        className="btn btn-secondary flex items-center"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5 mr-1" 
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path 
            fillRule="evenodd" 
            d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" 
            clipRule="evenodd" 
          />
        </svg>
        Download QR Code
      </button>
      
      <p className="mt-4 text-sm text-sap-grey">
        Present this QR code when you arrive at the event for quick check-in
      </p>
    </div>
  );
};

export default QRCodeDisplay;