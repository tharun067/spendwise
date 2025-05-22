import { FiArrowLeft } from 'react-icons/fi';
import { Link } from 'react-router-dom';

function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
            <div className="max-w-md w-full text-center">
                <h1 className="text-8xl font-bold text-primary-500">404</h1>
                <h2 className="text-2xl font-semibold text-neutral-800 mt-4">Page Not Found</h2>
                <p className="text-neutral-600 mt-2">
                    The page you are looking for doesn't exist or has been moved.
                </p>
                <Link to="/" className="mt-8 inline-flex items-center btn btn-primary">
                    <FiArrowLeft className="mr-2" />
                    Return to Dashboard
                </Link>
            </div>
        </div>
    );
};

export default NotFound
