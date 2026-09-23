import React, { useEffect, useState } from "react";

function Categories() {
    const [categories, setCategories] = useState([]);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [active, setActive] = useState(true);

    const [editingId, setEditingId] = useState(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");

    const API_URL =
    `${import.meta.env.VITE_API_URL}/api/categories`;

    const token =
        localStorage.getItem("adminToken");

    // =========================
    // FETCH CATEGORIES
    // =========================

    const fetchCategories = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(API_URL);

            if (!response.ok) {
                throw new Error(
                    "Unable to fetch categories"
                );
            }

            const data = await response.json();

            setCategories(data);

        } catch (error) {

            console.error(
                "Category fetch error:",
                error
            );

            setError(
                "Unable to load categories."
            );

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    // =========================
    // RESET FORM
    // =========================

    const resetForm = () => {
        setName("");
        setDescription("");
        setActive(true);
        setEditingId(null);
    };

    // =========================
    // CREATE / UPDATE
    // =========================

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!name.trim()) {
            alert("Category name is required.");
            return;
        }

        setSaving(true);

        try {

            const categoryData = {
                name: name.trim(),
                description: description.trim(),
                active: active
            };

            const url = editingId
                ? `${API_URL}/${editingId}`
                : API_URL;

            const method = editingId
                ? "PUT"
                : "POST";

            const response = await fetch(
                url,
                {
                    method: method,

                    headers: {
                        "Content-Type":
                            "application/json",

                        Authorization:
                            `Bearer ${token}`
                    },

                    body: JSON.stringify(
                        categoryData
                    )
                }
            );

            if (!response.ok) {

                const errorText =
                    await response.text();

                throw new Error(
                    errorText ||
                    "Unable to save category"
                );
            }

            await response.json();

            alert(
                editingId
                    ? "Category updated successfully."
                    : "Category created successfully."
            );

            resetForm();

            await fetchCategories();

        } catch (error) {

            console.error(
                "Category save error:",
                error
            );

            alert(
                "Unable to save category."
            );

        } finally {
            setSaving(false);
        }
    };

    // =========================
    // EDIT
    // =========================

    const handleEdit = (category) => {

        setEditingId(category.id);

        setName(category.name || "");

        setDescription(
            category.description || ""
        );

        setActive(
            category.active === true
        );

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    // =========================
    // DELETE
    // =========================

    const handleDelete = async (id) => {

        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this category?"
            );

        if (!confirmDelete) {
            return;
        }

        try {

            const response = await fetch(
                `${API_URL}/${id}`,
                {
                    method: "DELETE",

                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error(
                    "Unable to delete category"
                );
            }

            alert(
                "Category deleted successfully."
            );

            await fetchCategories();

        } catch (error) {

            console.error(
                "Category delete error:",
                error
            );

            alert(
                "Unable to delete category."
            );
        }
    };

    // =========================
    // CANCEL EDIT
    // =========================

    const handleCancel = () => {
        resetForm();
    };

    return (
        <div className="admin-page">

            {/* =========================
                PAGE HEADER
            ========================= */}

            <div className="page-header">

                <div>

                    <p className="page-eyebrow">
                        PRODUCT MANAGEMENT
                    </p>

                    <h1>
                        Categories
                    </h1>

                    <p>
                        Create and manage product
                        categories.
                    </p>

                </div>

            </div>


            {/* =========================
                CATEGORY FORM
            ========================= */}

            <div
                className="admin-form-card"
                style={{
                    marginBottom: "30px"
                }}
            >

                <h2>
                    {editingId
                        ? "Edit Category"
                        : "Add Category"}
                </h2>

                <form
                    onSubmit={handleSubmit}
                    className="admin-form"
                >

                    <input
                        className="admin-input"
                        type="text"
                        placeholder="Category Name"
                        value={name}
                        onChange={(event) =>
                            setName(
                                event.target.value
                            )
                        }
                        required
                    />

                    <textarea
                        className="admin-input"
                        placeholder="Category Description"
                        rows="4"
                        value={description}
                        onChange={(event) =>
                            setDescription(
                                event.target.value
                            )
                        }
                    />

                    <label
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            color: "#dbe4ef",
                            marginBottom: "15px"
                        }}
                    >

                        <input
                            type="checkbox"
                            checked={active}
                            onChange={(event) =>
                                setActive(
                                    event.target.checked
                                )
                            }
                        />

                        Active Category

                    </label>

                    <div
                        style={{
                            display: "flex",
                            gap: "10px"
                        }}
                    >

                        <button
                            className="admin-button"
                            type="submit"
                            disabled={saving}
                        >
                            {saving
                                ? "Saving..."
                                : editingId
                                ? "Update Category"
                                : "Add Category"}
                        </button>

                        {editingId && (
                            <button
                                type="button"
                                className="admin-button"
                                onClick={
                                    handleCancel
                                }
                            >
                                Cancel
                            </button>
                        )}

                    </div>

                </form>

            </div>


            {/* =========================
                CATEGORY LIST
            ========================= */}

            <div className="admin-table-card">

                <div
                    style={{
                        display: "flex",
                        justifyContent:
                            "space-between",
                        alignItems: "center",
                        marginBottom: "20px"
                    }}
                >

                    <h2>
                        All Categories
                    </h2>

                    <span
                        style={{
                            color: "#d4af37",
                            fontWeight: "700"
                        }}
                    >
                        {categories.length}
                    </span>

                </div>


                {loading && (
                    <p>
                        Loading categories...
                    </p>
                )}


                {error && (
                    <p>
                        {error}
                    </p>
                )}


                {!loading &&
                    !error &&
                    categories.length === 0 && (
                        <p>
                            No categories found.
                        </p>
                    )}


                {!loading &&
                    categories.length > 0 && (

                        <div
                            style={{
                                overflowX:
                                    "auto"
                            }}
                        >

                            <table
                                style={{
                                    width: "100%",
                                    borderCollapse:
                                        "collapse"
                                }}
                            >

                                <thead>

                                    <tr>

                                        <th
                                            style={{
                                                textAlign:
                                                    "left",
                                                padding:
                                                    "14px",
                                                color:
                                                    "#d4af37"
                                            }}
                                        >
                                            ID
                                        </th>

                                        <th
                                            style={{
                                                textAlign:
                                                    "left",
                                                padding:
                                                    "14px",
                                                color:
                                                    "#d4af37"
                                            }}
                                        >
                                            Name
                                        </th>

                                        <th
                                            style={{
                                                textAlign:
                                                    "left",
                                                padding:
                                                    "14px",
                                                color:
                                                    "#d4af37"
                                            }}
                                        >
                                            Description
                                        </th>

                                        <th
                                            style={{
                                                textAlign:
                                                    "left",
                                                padding:
                                                    "14px",
                                                color:
                                                    "#d4af37"
                                            }}
                                        >
                                            Status
                                        </th>

                                        <th
                                            style={{
                                                textAlign:
                                                    "left",
                                                padding:
                                                    "14px",
                                                color:
                                                    "#d4af37"
                                            }}
                                        >
                                            Actions
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {categories.map(
                                        (category) => (

                                            <tr
                                                key={
                                                    category.id
                                                }
                                            >

                                                <td
                                                    style={{
                                                        padding:
                                                            "14px",
                                                        color:
                                                            "#9eacbd"
                                                    }}
                                                >
                                                    {
                                                        category.id
                                                    }
                                                </td>

                                                <td
                                                    style={{
                                                        padding:
                                                            "14px",
                                                        color:
                                                            "#ffffff",
                                                        fontWeight:
                                                            "600"
                                                    }}
                                                >
                                                    {
                                                        category.name
                                                    }
                                                </td>

                                                <td
                                                    style={{
                                                        padding:
                                                            "14px",
                                                        color:
                                                            "#9eacbd"
                                                    }}
                                                >
                                                    {
                                                        category.description ||
                                                        "-"
                                                    }
                                                </td>

                                                <td
                                                    style={{
                                                        padding:
                                                            "14px"
                                                    }}
                                                >

                                                    <span
                                                        style={{
                                                            color:
                                                                category.active
                                                                    ? "#4ade80"
                                                                    : "#ef4444",
                                                            fontWeight:
                                                                "600"
                                                        }}
                                                    >
                                                        {category.active
                                                            ? "Active"
                                                            : "Inactive"}
                                                    </span>

                                                </td>

                                                <td
                                                    style={{
                                                        padding:
                                                            "14px"
                                                    }}
                                                >

                                                    <div
                                                        style={{
                                                            display:
                                                                "flex",
                                                            gap:
                                                                "8px"
                                                        }}
                                                    >

                                                        <button
                                                            className="admin-button"
                                                            type="button"
                                                            onClick={() =>
                                                                handleEdit(
                                                                    category
                                                                )
                                                            }
                                                        >
                                                            Edit
                                                        </button>

                                                        <button
                                                            className="admin-button"
                                                            type="button"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    category.id
                                                                )
                                                            }
                                                        >
                                                            Delete
                                                        </button>

                                                    </div>

                                                </td>

                                            </tr>

                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>

                    )}

            </div>

        </div>
    );
}

export default Categories;