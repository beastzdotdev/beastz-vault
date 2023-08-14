import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/sidebar';
import { RootNavbar } from '../components/navbar';

export default function Root() {
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
