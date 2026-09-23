import React, { useEffect, useState } from "react";

import {
    Search,
    CheckCircle,
    Trash2,
    Mail,
    Phone,
    Package,
    User
} from "lucide-react";

function Enquiries() {

    const API_URL =
        import.meta.env.VITE_API_URL;

    const [enquiries, setEnquiries] =
        useState([]);

    const [loading, setLoading] =
        useState(true);


    const token =
        localStorage.getItem("adminToken");
    const [search, setSearch] = useState("");

    const fetchEnquiries = async () => {

        try {

            const response = await fetch(
                `${API_URL}/api/enquiries`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`
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

            setEnquiries(data);

        } catch (error) {

            console.error(
                "Enquiries API error:",
                error
            );

        } finally {

            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEnquiries();
    }, []);

    const markAsRead = async (id) => {

        try {

            const response = await fetch(
                    `${API_URL}/api/enquiries/${id}/read`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error(
                    "Unable to mark enquiry as read"
                );
            }

            fetchEnquiries();

        } catch (error) {

            console.error(
                "Mark as read error:",
                error
            );
        }
    };

    const deleteEnquiry = async (id) => {

        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this enquiry?"
            );

        if (!confirmDelete) {
            return;
        }

        try {

            const response = await fetch(
                `${API_URL}/api/enquiries/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error(
                    "Unable to delete enquiry"
                );
            }

            fetchEnquiries();

        } catch (error) {

            console.error(
                "Delete enquiry error:",
                error
            );
        }
    };

    const filteredEnquiries =
        enquiries.filter((enquiry) => {

            const searchText =
                `${enquiry.customerName || ""}
                ${enquiry.email || ""}
                ${enquiry.phone || ""}
                ${enquiry.product || ""}
                ${enquiry.message || ""}`
                    .toLowerCase();

            return searchText.includes(
                search.toLowerCase()
            );
        });

    const unreadCount =
        enquiries.filter(
            (enquiry) =>
                enquiry.read !== true
        ).length;

    return (
        <div className="admin-page">

            <div className="page-header">

                <div>

                    <p className="page-eyebrow">
                        CUSTOMER COMMUNICATION
                    </p>

                    <h1>
                        Enquiries
                    </h1>

                    <p>
                        Manage customer enquiries
                        submitted through the
                        ZOSHA website.
                    </p>

                </div>

            </div>


            <div className="enquiry-stats">

                <div className="enquiry-stat">

                    <div className="admin-dashboard-icon">
                        <Mail />
                    </div>

                    <div>

                        <span>
                            Total Enquiries
                        </span>

                        <strong>
                            {enquiries.length}
                        </strong>

                    </div>

                </div>


                <div className="enquiry-stat">

                    <div className="admin-dashboard-icon">
                        <CheckCircle />
                    </div>

                    <div>

                        <span>
                            Unread
                        </span>

                        <strong>
                            {unreadCount}
                        </strong>

                    </div>

                </div>

            </div>


            <div className="products-section">

                <div className="product-search">

                    <Search
                        size={18}
                    />

                    <input
                        type="text"
                        placeholder="Search enquiries..."
                        value={search}
                        onChange={(event) =>
                            setSearch(
                                event.target.value
                            )
                        }
                    />

                </div>

            </div>


            {loading && (
                <div className="empty-state">
                    Loading enquiries...
                </div>
            )}


            {!loading &&
                filteredEnquiries.length === 0 && (
                    <div className="empty-state">
                        No enquiries found.
                    </div>
                )}


            {!loading &&
                filteredEnquiries.length > 0 && (

                    <div className="enquiries-list">

                        {filteredEnquiries.map(
                            (enquiry) => (

                                <div
                                    className={
                                        enquiry.read
                                            ? "enquiry-card"
                                            : "enquiry-card unread-card"
                                    }
                                    key={enquiry.id}
                                >

                                    <div className="enquiry-card-header">

                                        <div>

                                            <h3>

                                                <User
                                                    size={18}
                                                />

                                                {
                                                    enquiry.customerName
                                                }

                                            </h3>

                                            <span>

                                                {enquiry.createdAt
                                                    ? new Date(
                                                          enquiry.createdAt
                                                      ).toLocaleString()
                                                    : "Date unavailable"}

                                            </span>

                                        </div>


                                        <span
                                            className={
                                                enquiry.read
                                                    ? "status-badge active"
                                                    : "status-badge inactive"
                                            }
                                        >

                                            {enquiry.read
                                                ? "Read"
                                                : "Unread"}

                                        </span>

                                    </div>


                                    <div className="enquiry-details">

                                        {enquiry.email && (

                                            <div className="enquiry-detail">

                                                <Mail
                                                    size={16}
                                                />

                                                <span>
                                                    {
                                                        enquiry.email
                                                    }
                                                </span>

                                            </div>

                                        )}


                                        {enquiry.phone && (

                                            <div className="enquiry-detail">

                                                <Phone
                                                    size={16}
                                                />

                                                <span>
                                                    {
                                                        enquiry.phone
                                                    }
                                                </span>

                                            </div>

                                        )}


                                        {enquiry.product && (

                                            <div className="enquiry-detail">

                                                <Package
                                                    size={16}
                                                />

                                                <span>
                                                    {
                                                        enquiry.product
                                                    }
                                                </span>

                                            </div>

                                        )}

                                    </div>


                                    <div className="enquiry-message">

                                        <strong>
                                            Message
                                        </strong>

                                        <p>
                                            {
                                                enquiry.message
                                            }
                                        </p>

                                    </div>


                                    <div className="enquiry-actions">

                                        {!enquiry.read && (

                                            <button
                                                className="btn-secondary"
                                                onClick={() =>
                                                    markAsRead(
                                                        enquiry.id
                                                    )
                                                }
                                            >

                                                <CheckCircle
                                                    size={16}
                                                />

                                                Mark as Read

                                            </button>

                                        )}


                                        <button
                                            className="btn-danger"
                                            onClick={() =>
                                                deleteEnquiry(
                                                    enquiry.id
                                                )
                                            }
                                        >

                                            <Trash2
                                                size={16}
                                            />

                                            Delete

                                        </button>

                                    </div>

                                </div>

                            )
                        )}

                    </div>

                )}

        </div>
    );
}

export default Enquiries;