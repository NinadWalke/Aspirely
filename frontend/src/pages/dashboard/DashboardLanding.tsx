import * as React from 'react';
import { Link } from 'react-router';

export interface IDashboardLandingProps {
}

export default function DashboardLanding (props: IDashboardLandingProps) {
  return (
    <div>
      <h1>Dashboard Landing: Choose your feature</h1>
      <Link to={'/dashboard/task'}>Task Manager</Link> | {" "}
      <Link to={'/dashboard/notes'}>Notes Manager </Link> |  {" "}
      <Link to={'/dashboard/meditation'}>Meditation Logging</Link>
    </div>
  );
}
