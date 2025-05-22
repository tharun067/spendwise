import { FiDollarSign } from 'react-icons/fi';
import { Link } from 'react-router-dom';

function Logo() {
    return (
        <Link to="/" className="flex items-center">
            <div className="p-1 rounded-md bg-neutral-800 text-white">
                <FiDollarSign size={20} />
            </div>

            <span className="ml-2 text-lg font-bold bg-gradient-to-r from-cyan-800 via-sky-800 to-cyan-900 bg-clip-text text-transparent">
                SpendWise
            </span>
        </Link>
    );
}

export default Logo;
