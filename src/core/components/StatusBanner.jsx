// --- NEW Component: Status Banner ---
const StatusBanner = ({ message, type, onClose }) => {
    if (!message) return null;

    const bannerStyle = {
        padding: '12px',
        marginBottom: '20px',
        borderRadius: '8px',
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'white',
        backgroundColor: type === 'success' ? '#4CAF50' : '#f44336',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    };
    
    const closeButtonStyle = {
        background: 'none',
        border: 'none',
        color: 'white',
        fontSize: '18px',
        cursor: 'pointer',
        marginLeft: '10px',
    };

    return (
        <div style={bannerStyle}>
            {message}
            <button onClick={onClose} style={closeButtonStyle}>&times;</button>
        </div>
    );
};
// --- End Status Banner ---

export default StatusBanner;