import { Link } from 'react-router-dom';

const Photographer = () => {
    return (
        <div>
            <nav className='pg-list'>
                <h1 to="/">List</h1>
            </nav>

            <div className="photographer-list">
                <div className="card">
                    <Link to="/Photographer1">Photographer1</Link>
                </div>
                <div className="card">
                    <Link to="/Photographer2">Photographer2</Link>
                </div>
                <div className="card">
                    <Link to="/Photographer3">Photographer3</Link>
                </div>
                <div className="card">
                    <Link to="/Photographer4">Photographer4</Link>
                </div>
                <div className="card">
                    <Link to="/Photographer5">Photographer5</Link>
                </div>
            </div>
        </div>
    );
};

export default Photographer;
