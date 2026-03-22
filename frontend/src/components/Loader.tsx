import "./loader.css";

interface FullPageLoaderProps {
  message?: string;
}

export default function Loader({ message = "Loading" }: FullPageLoaderProps) {
  return (
    <div className="loader-overlay">
      <div className="loader-content">
        <div className="spinner" />
        <p className="loader-message">{message}</p>
      </div>
    </div>
  );
}