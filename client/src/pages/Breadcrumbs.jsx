import React from "react";
import { Link, useLocation } from "react-router-dom";

const Breadcrumbs = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split("/").filter((segment) => segment);

  return (
    <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-4">

    <nav className="py-1 px-4 flex items-center space-x-2 text-gray-700 dark:text-gray-300" >
      {/* Enlace a Inicio con icono */}
      <Link to="/" className="flex items-center text-gray-600 hover:text-orange-500 dark:text-gray-300 dark:hover:text-orange-400 transition-all duration-300 font-semibold">
        <span className="text-lg">🏠</span>
        <span className="ml-2">Inicio</span>
      </Link>

      {pathSegments.map((segment, index) => {
        const path = `/${pathSegments.slice(0, index + 1).join("/")}`;
        const isLast = index === pathSegments.length - 1;

        return (
          <React.Fragment key={index}>
            <span className="text-gray-400">➤</span>
            {isLast ? (
              <span className="text-orange-600 font-bold capitalize">{decodeURIComponent(segment)}</span>
            ) : (
              <Link to={path} className="text-gray-600 hover:text-orange-500 transition-all duration-300 font-semibold capitalize">
                {decodeURIComponent(segment)}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
    </div>
  );
};

export default Breadcrumbs;


