'use client';
import { NextPage } from 'next';

interface IErrorProps {
  error: Error;
  reset: () => void;
}

const Error: NextPage<IErrorProps> = () => {
  return (
    <div>
      <div className="mt-20 text-center">
        <h1 className="text-4xl font-black">ERROR - 500</h1>
        <p>Internal server error!</p>
      </div>
    </div>
  );
};
export default Error;
