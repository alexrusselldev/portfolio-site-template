'use client';
import { NextPage } from 'next';

const NotFound: NextPage<void> = () => {
  return (
    <div>
      <div className="mt-20 text-center">
        <h1 className="text-4xl font-black">ERROR - 404</h1>
        <p>Not found!</p>
      </div>
    </div>
  );
};
export default NotFound;
