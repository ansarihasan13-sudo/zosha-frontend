import React, { useEffect, useState } from "react";

import Products from "./Products";
import Categories from "./Categories";
import Enquiries from "./Enquiries";

import {
    LayoutDashboard,
    Package,
    Tags,
    MessageSquare,
    LogOut
} from "lucide-react";

function AdminDashboard() {

    const API_URL =
        import.meta.env.VITE_API_URL;

    const [activePage, setActivePage] =
        useState("dashboard");

    const [enquiryCount, setEnquiryCount] =
        useState(0);

    const [unreadCount, setUnreadCount] =
        useState(0);

    /* =====================================================
       FETCH ENQUIRY COUNT
    ===================================================== */

    const fetchEnquiryCount = async () => {

        try {

            const token =
                localStorage.getItem("adminToken");

            const response = await fetch(
                         `${API_URL}/api/enquiries`,
                        {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error(
                    "Unable to fetch enquiries"
                );
            }

            const data =
                await response.json();

            setEnquiryCount(data.length);

            setUnreadCount(
                data.filter(
                    (enquiry) =>
                        enquiry.read !== true
                ).length
            );

        } catch (error) {

            console.error(
                "Dashboard enquiry error:",
                error
            );

        }

    };


   /* =====================================================
   LOAD ENQUIRIES WHEN DASHBOARD OPENS
===================================================== */

useEffect(() => {

    fetchEnquiryCount();

    const interval = setInterval(() => {
        fetchEnquiryCount();
    }, 5000);

    return () => {
        clearInterval(interval);
    };

}, []);

    /* =====================================================
       LOGOUT
    ===================================================== */

    const logout = () => {

        localStorage.removeItem(
            "adminToken"
        );

        localStorage.removeItem(
            "adminUsername"
        );

        window.location.href = "/admin";

    };


    /* =====================================================
       PAGE CONTENT
    ===================================================== */

    const renderContent = () => {

        if (activePage === "products") {

            return <Products />;

        }


        if (activePage === "categories") {

            return <Categories />;

        }


        if (activePage === "enquiries") {

            return <Enquiries />;

        }


        return (

            <div className="admin-page">

                <div className="page-header">

                    <div>

                        <p className="page-eyebrow">
                            ZOSHA ADMINISTRATION
                        </p>

                        <h1>
                            Dashboard
                        </h1>

                        <p>
                            Manage your products,
                            categories and customer
                            enquiries.
                        </p>

                    </div>

                </div>


                {/* =================================================
                   DASHBOARD CARDS
                ================================================= */}

                <div className="admin-dashboard-cards">


                    {/* PRODUCTS */}

                    <div
                        className="admin-dashboard-card"
                        onClick={() =>
                            setActivePage(
                                "products"
                            )
                        }
                        style={{
                            cursor: "pointer"
                        }}
                    >

                        <div className="admin-dashboard-icon">

                            <Package />

                        </div>


                        <div>

                            <h3>
                                Products
                            </h3>

                            <p>
                                Manage your product
                                catalogue.
                            </p>

                        </div>

                    </div>


                    {/* CATEGORIES */}

                    <div
                        className="admin-dashboard-card"
                        onClick={() =>
                            setActivePage(
                                "categories"
                            )
                        }
                        style={{
                            cursor: "pointer"
                        }}
                    >

                        <div className="admin-dashboard-icon">

                            <Tags />

                        </div>


                        <div>

                            <h3>
                                Categories
                            </h3>

                            <p>
                                Manage product
                                categories.
                            </p>

                        </div>

                    </div>


                    {/* ENQUIRIES */}

                    <div
                        className="admin-dashboard-card"
                        onClick={() =>
                            setActivePage(
                                "enquiries"
                            )
                        }
                        style={{
                            cursor: "pointer"
                        }}
                    >

                        <div className="admin-dashboard-icon">

                            <MessageSquare />

                        </div>


                        <div>

                            <h3>
                                Enquiries
                            </h3>

                            <p>
                                Total: {enquiryCount}
                            </p>

                            <p>
                                Unread: {unreadCount}
                            </p>

                        </div>

                    </div>


                </div>

            </div>

        );

    };


    /* =====================================================
       MAIN ADMIN LAYOUT
    ===================================================== */

    return (

        <div className="admin-layout">


            {/* =================================================
               SIDEBAR
            ================================================= */}

            <aside className="admin-sidebar">


                <div className="admin-logo">

                    <strong>
                        ZOSHA
                    </strong>

                    <span>
                        INTERNATIONAL TRADERS
                    </span>

                </div>


                <nav className="admin-nav">


                    {/* DASHBOARD */}

                    <button
                        className={
                            activePage ===
                            "dashboard"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setActivePage(
                                "dashboard"
                            )
                        }
                    >

                        <LayoutDashboard
                            size={18}
                        />

                        Dashboard

                    </button>


                    {/* PRODUCTS */}

                    <button
                        className={
                            activePage ===
                            "products"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setActivePage(
                                "products"
                            )
                        }
                    >

                        <Package
                            size={18}
                        />

                        Products

                    </button>


                    {/* CATEGORIES */}

                    <button
                        className={
                            activePage ===
                            "categories"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setActivePage(
                                "categories"
                            )
                        }
                    >

                        <Tags
                            size={18}
                        />

                        Categories

                    </button>


                    {/* ENQUIRIES */}

                    <button
                        className={
                            activePage ===
                            "enquiries"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setActivePage(
                                "enquiries"
                            )
                        }
                    >

                        <MessageSquare
                            size={18}
                        />

                        Enquiries

                    </button>


                </nav>


                {/* LOGOUT */}

                <button
                    className="admin-logout"
                    onClick={logout}
                >

                    <LogOut
                        size={18}
                    />

                    Logout

                </button>


            </aside>


            {/* =================================================
               MAIN
            ================================================= */}

            <main className="admin-main">


                {/* TOPBAR */}

                <div className="admin-topbar">

                    <div>

                        <span>
                            Admin Panel
                        </span>

                    </div>


                    <div className="admin-user">

                        {
                            localStorage.getItem(
                                "adminUsername"
                            ) || "Admin"
                        }

                    </div>

                </div>


                {/* PAGE CONTENT */}

                {renderContent()}


            </main>


        </div>

    );

}

export default AdminDashboard;