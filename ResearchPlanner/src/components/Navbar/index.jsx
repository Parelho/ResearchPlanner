import React from "react";
import { Link } from 'react-router-dom';
import 'boxicons/css/boxicons.min.css';
import HomeImage from '../../assets/logo.png';

export default function Navbar() {
  return (
    <div>
      <div className="min-h-screen flex flex-row bg-gray-100 border-r border-black">
        <div className="flex flex-col w-56 bg-white overflow-hidden">
          <ul className="flex flex-col py-4">
            <li>
              <Link
                to="/home"
                className="flex flex-row items-center h-32 w-auto transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-gray-800"
              >
                <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400">
                </span>
                <img
                  src={HomeImage}
                  alt="Home"
                  className="h-32 w-auto"
                />
              </Link>
            </li>
            <li>
              <Link to="/researchers" className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-gray-800">
                <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400">
                  <i className="bx bxs-graduation"></i>
                </span>
                <span className="text-sm font-medium">Pesquisadores</span>
              </Link>
            </li>
            <li>
              <Link to="/planner" className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-gray-800">
                <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400">
                  <i className="bx bxs-book"></i>
                </span>
                <span className="text-sm font-medium">Planner</span>
              </Link>
            </li>
            {/* <li>
              <Link to="/home" className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-gray-800">
                <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400">
                  <i className="bx bx-user"></i>
                </span>
                <span className="text-sm font-medium">Perfil</span>
              </Link>
            </li>*/}
            <li>
              <a href="#" className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-gray-800">
                <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400">
                  <i className="bx bx-log-out"></i>
                </span>
                <span className="text-sm font-medium">Logout</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}