
import React from 'react';
import { Outlet, useParams } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';

const ProtectedLayout = () => {
  const { id, tripId } = useParams();
  const activeTripId = id || tripId;

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-muted/20">
      <Sidebar tripId={activeTripId} />
      <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default ProtectedLayout;
