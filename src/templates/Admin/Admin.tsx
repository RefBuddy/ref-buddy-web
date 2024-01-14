import React from 'react';
import Navbar from '../../components/Navbar';

const Admin: React.FC = () => {
    return (
        <div style={{ display: 'flex' }}>
            <Navbar />
            <h1>Welcome to the Admin page!</h1>
            <p>This is a default page to get you started.</p>
        </div>
    );
};

export default Admin;
