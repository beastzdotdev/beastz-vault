import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/sidebar';
import { RootNavbar } from '../components/navbar';
import { useEffect } from 'react';

export default function Root() {
  useEffect(() => {
    //TODO register listener here and redirect user on refres token expire/reuse
  }, []);
  return (
    <>
      <RootNavbar />

      <div className="flex">
        <div className="w-[250px]">
          <Sidebar />
        </div>

        <div className="m-[100px]">
          <Outlet />
        </div>
      </div>
    </>
  );
}
