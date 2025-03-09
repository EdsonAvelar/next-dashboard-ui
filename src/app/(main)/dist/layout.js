"use strict";
exports.__esModule = true;
exports.metadata = void 0;
var google_1 = require("next/font/google");
require("../globals.css");
var Navbar_1 = require("@/components/Navbar");
var Sidebar_1 = require("@/components/Sidebar");
var react_toastify_1 = require("react-toastify");
require("react-toastify/ReactToastify.css");
var inter = google_1.Inter({ subsets: ["latin"] });
exports.metadata = {
    title: "Lama Dev School Management Dashboard",
    description: "Next.js School Management System"
};
function RootLayout(_a) {
    var children = _a.children;
    return (React.createElement("html", { lang: "en" },
        React.createElement("body", { className: inter.className },
            React.createElement("div", { className: "h-screen flex" },
                React.createElement(Sidebar_1["default"], null),
                React.createElement("div", { className: "flex-1 bg-[#F7F8FA] overflow-scroll flex flex-col" },
                    React.createElement(Navbar_1["default"], null),
                    children)),
            React.createElement(react_toastify_1.ToastContainer, { position: "bottom-right", theme: "colored" }))));
}
exports["default"] = RootLayout;
