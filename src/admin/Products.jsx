import React, { useEffect, useState } from "react";

import {
    Search,
    Plus,
    Pencil,
    Trash2,
    X,
    Upload
} from "lucide-react";
const API_BASE_URL =
    import.meta.env.VITE_API_URL;

function Products() {

    const [products, setProducts] =
        useState([]);

    const [categories, setCategories] =
        useState([]);

    const [search, setSearch] =
        useState("");

    const [loading, setLoading] =
        useState(true);

    const [editingId, setEditingId] =
        useState(null);

    const [selectedFile, setSelectedFile] =
        useState(null);

    const [previewUrl, setPreviewUrl] =
        useState("");

    const [uploading, setUploading] =
        useState(false);

    const [form, setForm] = useState({
        name: "",
        description: "",
        imageUrl: "",
        categoryId: "",
        active: true
    });

    const token =
        localStorage.getItem("adminToken");

    const getImageUrl = (imageUrl) => {

        if (!imageUrl) {
            return "";
        }

        if (imageUrl.startsWith("http")) {
            return imageUrl;
        }

        return API_BASE_URL + imageUrl;
    };

    const fetchProducts = async () => {

        try {

            const response = await fetch(
                `${API_BASE_URL}/api/products`
            );

            if (!response.ok) {
                throw new Error(
                    "Unable to fetch products"
                );
            }

            const data =
                await response.json();

            setProducts(data);

        } catch (error) {

            console.error(
                "Products API error:",
                error
            );

        } finally {

            setLoading(false);
        }
    };

    const fetchCategories = async () => {

        try {

            const response = await fetch(
                `${API_BASE_URL}/api/categories`
            );

            if (!response.ok) {
                throw new Error(
                    "Unable to fetch categories"
                );
            }

            const data =
                await response.json();

            setCategories(data);

        } catch (error) {

            console.error(
                "Categories API error:",
                error
            );
        }
    };

    useEffect(() => {

        fetchProducts();
        fetchCategories();

    }, []);

    const handleChange = (event) => {

        const {
            name,
            value,
            type,
            checked
        } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]:
                type === "checkbox"
                    ? checked
                    : value
        }));
    };

    const handleFileChange = (event) => {

        const file =
            event.target.files[0];

        if (!file) {
            return;
        }

        if (!file.type.startsWith("image/")) {

            alert(
                "Please select an image file."
            );

            return;
        }

        setSelectedFile(file);

        const localPreview =
            URL.createObjectURL(file);

        setPreviewUrl(localPreview);
    };

    const uploadImage = async () => {

        if (!selectedFile) {
            return form.imageUrl;
        }

        const formData =
            new FormData();

        formData.append(
            "file",
            selectedFile
        );

        const response = await fetch(
            `${API_BASE_URL}/api/uploads/image`,
            {
                method: "POST",
                headers: {
                    Authorization:
                        `Bearer ${token}`
                },
                body: formData
            }
        );

        if (!response.ok) {
            throw new Error(
                "Image upload failed"
            );
        }

        const data =
            await response.json();

        return data.imageUrl;
    };

    const resetForm = () => {

        setForm({
            name: "",
            description: "",
            imageUrl: "",
            categoryId: "",
            active: true
        });

        setEditingId(null);
        setSelectedFile(null);
        setPreviewUrl("");
    };

    const handleSubmit = async (event) => {

        event.preventDefault();

        try {

            setUploading(true);

            let imageUrl =
                form.imageUrl;

            if (selectedFile) {

                imageUrl =
                    await uploadImage();
            }

            const requestData = {

                name: form.name,

                description:
                    form.description,

                imageUrl: imageUrl,

                categoryId:
                    form.categoryId
                        ? Number(
                              form.categoryId
                          )
                        : null,

                active: form.active
            };

            const url = editingId
                ? `${API_BASE_URL}/api/products/${editingId}`
                : `${API_BASE_URL}/api/products`;

            const method = editingId
                ? "PUT"
                : "POST";

            const response = await fetch(
                url,
                {
                    method,

                    headers: {
                        "Content-Type":
                            "application/json",

                        Authorization:
                            `Bearer ${token}`
                    },

                    body:
                        JSON.stringify(
                            requestData
                        )
                }
            );

            if (!response.ok) {

                throw new Error(
                    "Unable to save product"
                );
            }

            alert(
                editingId
                    ? "Product updated successfully."
                    : "Product added successfully."
            );

            resetForm();

            fetchProducts();

        } catch (error) {

            console.error(
                "Product save error:",
                error
            );

            alert(
                error.message ||
                    "Unable to save product."
            );

        } finally {

            setUploading(false);
        }
    };

    const handleEdit = (product) => {

        setEditingId(product.id);

        setForm({
            name:
                product.name || "",

            description:
                product.description || "",

            imageUrl:
                product.imageUrl || "",

            categoryId:
                product.categoryId
                    ? String(
                          product.categoryId
                      )
                    : "",

            active:
                product.active === true
        });

        setSelectedFile(null);

        setPreviewUrl(
            product.imageUrl
                ? getImageUrl(
                      product.imageUrl
                  )
                : ""
        );
    };

    const handleDelete = async (id) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this product?"
            );

        if (!confirmed) {
            return;
        }

        try {

            const response = await fetch(
                `${API_BASE_URL}/api/products/${id}`,
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
                    "Unable to delete product"
                );
            }

            fetchProducts();

        } catch (error) {

            console.error(
                "Product delete error:",
                error
            );

            alert(
                "Unable to delete product."
            );
        }
    };

    const filteredProducts =
        products.filter((product) => {

            const searchText =
                `${product.name || ""}
                ${product.description || ""}
                ${product.categoryName || ""}`
                    .toLowerCase();

            return searchText.includes(
                search.toLowerCase()
            );
        });

    return (
        <div className="admin-page">

            <div className="page-header">

                <div>

                    <p className="page-eyebrow">
                        PRODUCT MANAGEMENT
                    </p>

                    <h1>
                        Products
                    </h1>

                    <p>
                        Manage your ZOSHA
                        product catalogue.
                    </p>

                </div>

            </div>

            <div className="admin-form-card">

                <div className="form-card-header">

                    <div>

                        <h2>
                            {editingId
                                ? "Edit Product"
                                : "Add Product"}
                        </h2>

                        <p>
                            {editingId
                                ? "Update product information."
                                : "Add a new product to your catalogue."}
                        </p>

                    </div>

                    {editingId && (

                        <button
                            type="button"
                            className="icon-button"
                            onClick={
                                resetForm
                            }
                        >
                            <X
                                size={18}
                            />
                        </button>

                    )}

                </div>

                <form
                    className="admin-form"
                    onSubmit={
                        handleSubmit
                    }
                >

                    <div className="form-row">

                        <div className="form-group">

                            <label>
                                Product Name
                            </label>

                            <input
                                type="text"
                                name="name"
                                required
                                value={
                                    form.name
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="e.g. LED Light"
                            />

                        </div>

                        <div className="form-group">

                            <label>
                                Category
                            </label>

                            <select
                                name="categoryId"
                                value={
                                    form.categoryId
                                }
                                onChange={
                                    handleChange
                                }
                            >

                                <option value="">
                                    Select Category
                                </option>

                                {categories.map(
                                    (category) => (

                                        <option
                                            key={
                                                category.id
                                            }
                                            value={
                                                category.id
                                            }
                                        >
                                            {
                                                category.name
                                            }
                                        </option>

                                    )
                                )}

                            </select>

                        </div>

                    </div>

                    <div className="form-group">

                        <label>
                            Product Description
                        </label>

                        <textarea
                            name="description"
                            rows="4"
                            value={
                                form.description
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="Enter product description"
                        />

                    </div>

                    <div className="form-group">

                        <label>
                            Product Image
                        </label>

                        <div className="image-upload-box">

                            <input
                                id="productImage"
                                type="file"
                                accept="image/*"
                                onChange={
                                    handleFileChange
                                }
                                hidden
                            />

                            <label
                                htmlFor="productImage"
                                className="upload-label"
                            >
                                <Upload
                                    size={20}
                                />

                                <span>
                                    {selectedFile
                                        ? selectedFile.name
                                        : "Choose Product Image"}
                                </span>

                                <small>
                                    JPG, PNG, WEBP
                                </small>
                            </label>

                            {previewUrl && (

                                <div className="image-preview">

                                    <img
                                        src={
                                            previewUrl
                                        }
                                        alt="Product preview"
                                    />

                                </div>

                            )}

                        </div>

                    </div>

                    <label className="checkbox-label">

                        <input
                            type="checkbox"
                            name="active"
                            checked={
                                form.active
                            }
                            onChange={
                                handleChange
                            }
                        />

                        <span>
                            Active Product
                        </span>

                    </label>

                    <div className="form-actions">

                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={
                                uploading
                            }
                        >

                            {uploading ? (
                                "Uploading..."
                            ) : (
                                <>
                                    <Plus
                                        size={17}
                                    />

                                    {editingId
                                        ? "Update Product"
                                        : "Add Product"}
                                </>
                            )}

                        </button>

                        {editingId && (

                            <button
                                type="button"
                                className="btn-secondary"
                                onClick={
                                    resetForm
                                }
                            >
                                Cancel
                            </button>

                        )}

                    </div>

                </form>

            </div>

            <div className="products-section">

                <div className="section-toolbar">

                    <div>

                        <h2>
                            All Products
                        </h2>

                        <p>
                            {products.length}{" "}
                            products
                        </p>

                    </div>

                    <div className="product-search">

                        <Search
                            size={18}
                        />

                        <input
                            type="text"
                            placeholder="Search products..."
                            value={
                                search
                            }
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
                        Loading products...
                    </div>
                )}

                {!loading &&
                    filteredProducts.length ===
                        0 && (
                        <div className="empty-state">
                            No products found.
                        </div>
                    )}

                {!loading &&
                    filteredProducts.length >
                        0 && (

                    <div className="table-wrapper">

                        <table className="products-table">

                            <thead>

                                <tr>

                                    <th>
                                        Product
                                    </th>

                                    <th>
                                        Category
                                    </th>

                                    <th>
                                        Status
                                    </th>

                                    <th>
                                        Actions
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {filteredProducts.map(
                                    (product) => (

                                        <tr
                                            key={
                                                product.id
                                            }
                                        >

                                            <td>

                                                <div className="product-info">

                                                    <div className="product-thumb">

                                                        {product.imageUrl ? (

                                                            <img
                                                                src={
                                                                    getImageUrl(
                                                                        product.imageUrl
                                                                    )
                                                                }
                                                                alt={
                                                                    product.name
                                                                }
                                                            />

                                                        ) : (

                                                            <span>
                                                                No Image
                                                            </span>

                                                        )}

                                                    </div>

                                                    <div>

                                                        <strong>
                                                            {
                                                                product.name
                                                            }
                                                        </strong>

                                                        <small>
                                                            {
                                                                product.description
                                                            }
                                                        </small>

                                                    </div>

                                                </div>

                                            </td>

                                            <td>
                                                {
                                                    product.categoryName ||
                                                    "—"
                                                }
                                            </td>

                                            <td>

                                                <span
                                                    className={
                                                        product.active
                                                            ? "status-badge active"
                                                            : "status-badge inactive"
                                                    }
                                                >
                                                    {product.active
                                                        ? "Active"
                                                        : "Inactive"}
                                                </span>

                                            </td>

                                            <td>

                                                <div className="action-buttons">

                                                    <button
                                                        className="action-edit"
                                                        onClick={() =>
                                                            handleEdit(
                                                                product
                                                            )
                                                        }
                                                    >
                                                        <Pencil
                                                            size={
                                                                16
                                                            }
                                                        />
                                                    </button>

                                                    <button
                                                        className="action-delete"
                                                        onClick={() =>
                                                            handleDelete(
                                                                product.id
                                                            )
                                                        }
                                                    >
                                                        <Trash2
                                                            size={
                                                                16
                                                            }
                                                        />
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

export default Products;