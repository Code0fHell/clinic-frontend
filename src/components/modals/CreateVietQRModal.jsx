import { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { createVietQR, getPaymentStatus } from '../../api/payment.api';
import './CreateVietQRModal.css';

export default function CreateVietQRModal({ billId, amount, onSuccess, onClose }) {
    const [loading, setLoading] = useState(true);
    const [qrBase64, setQrBase64] = useState(null);
    const [checkoutUrl, setCheckoutUrl] = useState(null);
    const [orderCode, setOrderCode] = useState(null);
    const [paymentId, setPaymentId] = useState(null);
    const [status, setStatus] = useState('PENDING');
    const [error, setError] = useState(null);
    const [pollingActive, setPollingActive] = useState(false);

    // Tạo VietQR khi component mount
    useEffect(() => {
        async function create() {
            setLoading(true);
            setError(null);
            try {
                const res = await createVietQR({ bill_id: billId, amount });
                console.log('CreateVietQR response:', res);

                setPaymentId(res.paymentId);
                setOrderCode(res.orderCode);
                setCheckoutUrl(res.checkoutUrl);

                // Xử lý qrCode payload và chuyển thành hình ảnh
                if (res.qrCode) {
                    try {
                        // Payload VietQR QR - chuyển thành dataURL image
                        QRCode.toDataURL(res.qrCode, {
                            errorCorrectionLevel: 'H',
                            type: 'image/png',
                            quality: 0.92,
                            margin: 1,
                            width: 300,
                        }).then((dataUrl) => {
                            console.log('QR Code generated successfully');
                            setQrBase64(dataUrl);
                        }).catch((err) => {
                            console.error('Failed to generate QR image:', err);
                            setError('Không thể tạo mã QR');
                        });
                    } catch (err) {
                        console.error('Failed to generate QR image:', err);
                        setError('Không thể tạo mã QR');
                    }
                }

                setPollingActive(true);
            } catch (err) {
                console.error('Create VietQR failed:', err);
                setError(err.response?.data?.message || 'Lỗi tạo VietQR');
                setPollingActive(false);
            } finally {
                setLoading(false);
            }
        }

        if (billId && amount) {
            create();
        }
    }, [billId, amount]);

    // Step 2: Poll trạng thái thanh toán mỗi 3 giây
    useEffect(() => {
        if (!pollingActive || !orderCode) return;

        let isMounted = true;
        const interval = setInterval(async () => {
            try {
                const res = await getPaymentStatus(orderCode);
                console.log('Payment status:', res);

                if (isMounted) {
                    const paymentStatus = res.payment_status || res.status || 'PENDING';
                    setStatus(paymentStatus);

                    if (paymentStatus === 'SUCCESS' || paymentStatus === 'PAID') {
                        setPollingActive(false);
                        clearInterval(interval);
                        // Gọi callback success
                        if (onSuccess) {
                            onSuccess({
                                paymentId,
                                orderCode,
                                status: paymentStatus,
                            });
                        }
                    }
                }
            } catch (e) {
                console.error('Error checking payment status:', e);
                // Tiếp tục polling khi lỗi (có thể endpoint không sẵn sàng)
            }
        }, 3000);

        return () => {
            isMounted = false;
            clearInterval(interval);
        };
    }, [pollingActive, orderCode, paymentId, onSuccess]);

    return (
        <div className="vietqr-modal-overlay">
            <div className="vietqr-modal-content">
                <div className="vietqr-modal-header">
                    <h2>Thanh toán VietQR</h2>
                    <button className="vietqr-close-btn" onClick={onClose}>✕</button>
                </div>

                <div className="vietqr-modal-body">
                    {loading && (
                        <div className="vietqr-loading">
                            <p>Đang tạo mã QR...</p>
                            <div className="spinner"></div>
                        </div>
                    )}

                    {error && (
                        <div className="vietqr-error">
                            <p>❌ {error}</p>
                            <button onClick={onClose}>Đóng</button>
                        </div>
                    )}

                    {!loading && !error && qrBase64 && (
                        <div className="vietqr-success">
                            <h3>Quét mã QR để thanh toán</h3>
                            <div className="vietqr-qr-container">
                                <img src={qrBase64} alt="VietQR QR Code" />
                            </div>

                            {checkoutUrl && (
                                <p className="vietqr-or-text">hoặc</p>
                            )}

                            {checkoutUrl && (
                                <a
                                    href={checkoutUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="vietqr-checkout-btn"
                                >
                                    Thanh toán qua PayOS
                                </a>
                            )}

                            <div className="vietqr-status-box">
                                <p className="vietqr-status-label">Trạng thái:</p>
                                <p className={`vietqr-status-value ${status.toLowerCase()}`}>
                                    {status === 'PENDING' && '⏳ Chờ thanh toán'}
                                    {status === 'SUCCESS' && '✅ Thanh toán thành công'}
                                    {status === 'FAILED' && '❌ Thanh toán thất bại'}
                                </p>
                            </div>

                            {status === 'PENDING' && (
                                <p className="vietqr-hint">
                                    Bạn sẽ tự động được thông báo khi thanh toán hoàn tất
                                </p>
                            )}

                            {(status === 'SUCCESS') && (
                                <button onClick={onClose} className="vietqr-close-success-btn">
                                    Hoàn thành
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
