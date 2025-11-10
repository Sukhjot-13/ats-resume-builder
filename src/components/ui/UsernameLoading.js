const UsernameLoading = ({ text = "LOADING", className }) => {
  const letters = text.split("");

  return (
    <div className={`loading loading07 ${className}`}>
      {letters.map((letter, index) => (
        <span key={index} data-text={letter}>
          {letter}
        </span>
      ))}
    </div>
  );
};

export default UsernameLoading;
