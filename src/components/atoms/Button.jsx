'use client';

const Button = ({ children, onClick, type }) => {
  return (
    <button
      onClick={onClick}
      type={type}
      className="px-4 py-2 text-secondary bg-primary rounded hover:bg-primary/80 hover:cursor-pointer transition duration-300 ease-in-out"
    >
      {children}
    </button>
  );
};

export default Button;