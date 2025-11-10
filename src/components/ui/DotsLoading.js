import './dots-loading.css';

const DotsLoading = ({ className }) => {
  return (
    <div className={`dots-loading ${className}`}>
      <div className="dot"></div>
      <div className="dot"></div>
      <div className="dot"></div>
    </div>
  );
};

export default DotsLoading;
