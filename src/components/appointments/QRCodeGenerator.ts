import QRCode from "qrcode";

interface QRCodeData {
  businessId: string;
  appointmentId: string;
  token: string;
  date: string;
  service: string;
}

export const generateQRCode = async (appointmentData: QRCodeData) => {
  try {
    const qrData = JSON.stringify(appointmentData);
    return await QRCode.toDataURL(qrData);
  } catch (err) {
    console.error("Error generating QR code:", err);
    return null;
  }
};