import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

import {
    Menu,
    X,
    ArrowRight,
    Ship,
    Plane,
    Package,
    Search,
    ShieldCheck,
    Globe2,
    MessageCircle,
    Phone,
    Mail,
    MapPin
} from "lucide-react";

import AdminLogin from "./admin/AdminLogin";

const services = [
    [
        Ship,
        "Sea Freight",
        "Cost-effective shipping solutions for your cargo."
    ],
    [
        Plane,
        "Air Freight",
        "Fast delivery for time-sensitive shipments."
    ],
    [
        Package,
        "Container Support",
        "Support for container and cargo requirements."
    ],
    [
        Search,
        "Product Sourcing",
        "Find suitable products and trusted suppliers."
    ],
    [
        ShieldCheck,
        "Customs Assistance",
        "Guidance with trade documents and customs."
    ],
    [
        Globe2,
        "Worldwide Delivery",
        "International shipping support from China."
    ]
];

function CustomerWebsite() {
    const [open, setOpen] = useState(false);
    const [q, setQ] = useState("");
    const [cat, setCat] = useState("All");
    const [dark, setDark] = useState(false);
    const API_URL = import.meta.env.VITE_API_URL;

    const [products, setProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [productError, setProductError] = useState(false);

    const [enquiry, setEnquiry] = useState({
        customerName: "",
        email: "",
        phone: "",
        product: "",
        message: ""
    });

    const [enquirySending, setEnquirySending] = useState(false);

    const go = (id) => {
        setOpen(false);

        document
            .getElementById(id)
            ?.scrollIntoView({
                behavior: "smooth"
            });
    };

    useEffect(() => {
        fetch(`${API_URL}/api/products`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(
                        "Unable to fetch products"
                    );
                }

                return response.json();
            })
            .then((data) => {
                console.log("Products from API:", data);

                setProducts(data);
                setLoadingProducts(false);
            })
            .catch((error) => {
                console.error(
                    "Product API error:",
                    error
                );

                setProductError(true);
                setLoadingProducts(false);
            });
    }, []);

    const activeProducts = products.filter(
        (product) => product.active === true
    );

    const categories = [
        "All",
        ...new Set(
            activeProducts
                .map(
                    (product) =>
                        product.categoryName
                )
                .filter(Boolean)
        )
    ];

    const shownProducts = activeProducts.filter(
        (product) => {
            const matchesCategory =
                cat === "All" ||
                product.categoryName === cat;

            const searchText =
                `${product.name} ${
                    product.description || ""
                } ${
                    product.categoryName || ""
                }`.toLowerCase();

            const matchesSearch =
                searchText.includes(
                    q.toLowerCase()
                );

            return (
                matchesCategory &&
                matchesSearch
            );
        }
    );

    const handleEnquiryChange = (event) => {
        const {
            name,
            value
        } = event.target;

        setEnquiry((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const handleEnquirySubmit = async (event) => {
        event.preventDefault();

        setEnquirySending(true);

        try {
           const response = await fetch(
    `${API_URL}/api/enquiries`,
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(enquiry)
    }
);

            if (!response.ok) {
                throw new Error(
                    "Unable to submit enquiry"
                );
            }

            alert(
                "Thank you! Your enquiry has been submitted successfully."
            );

            setEnquiry({
                customerName: "",
                email: "",
                phone: "",
                product: "",
                message: ""
            });
        } catch (error) {
            console.error(
                "Enquiry submission error:",
                error
            );

            alert(
                "Unable to submit enquiry. Please try again."
            );
        } finally {
            setEnquirySending(false);
        }
    };

    return (
        <div
            className={
                dark
                    ? "app darkMode"
                    : "app"
            }
        >
            <header>
                <div className="container nav">

                    <button
                        className="brand"
                        onClick={() =>
                            go("home")
                        }
                    >
                        <b>ZOSHA</b>

                        <small>
                            INTERNATIONAL TRADERS
                        </small>
                    </button>

                    <div className="nav-actions">

                        <button
                            className="theme"
                            aria-label="Toggle dark mode"
                            onClick={() =>
                                setDark(!dark)
                            }
                        >
                            {dark
                                ? "☀️"
                                : "🌙"}
                        </button>

                        <button
                            className="menu"
                            onClick={() =>
                                setOpen(!open)
                            }
                        >
                            {open ? (
                                <X />
                            ) : (
                                <Menu />
                            )}
                        </button>

                    </div>

                    <nav
                        className={
                            open
                                ? "open"
                                : ""
                        }
                    >
                        {[
                            ["home", "Home"],
                            ["about", "About"],
                            [
                                "services",
                                "Services"
                            ],
                            [
                                "products",
                                "Products"
                            ],
                            ["why", "Why Us"],
                            [
                                "contact",
                                "Contact"
                            ]
                        ].map(
                            ([id, label]) => (
                                <button
                                    key={id}
                                    onClick={() =>
                                        go(id)
                                    }
                                >
                                    {label}
                                </button>
                            )
                        )}

                        <button
                            className="cta"
                            onClick={() =>
                                go("contact")
                            }
                        >
                            Get a Quote

                            <ArrowRight
                                size={16}
                            />
                        </button>
                    </nav>

                </div>
            </header>

            <section
                id="home"
                className="hero"
            >
                <div className="container heroGrid">

                    <div>

                        <p className="eyebrow">
                            GLOBAL SOURCING •
                            IMPORT • EXPORT
                        </p>

                        <h1>
                            Your Trusted{" "}
                            <span>
                                China Sourcing
                            </span>{" "}
                            Partner
                        </h1>

                        <p className="lead">
                            Source quality
                            products from China
                            with confidence,
                            competitive pricing
                            and reliable
                            international trade
                            support.
                        </p>

                        <div className="actions">

                            <button
                                className="btn gold"
                                onClick={() =>
                                    go("contact")
                                }
                            >
                                Get a Quote

                                <ArrowRight />
                            </button>

                            <button
                                className="btn outline"
                                onClick={() =>
                                    go("products")
                                }
                            >
                                Explore Products
                            </button>

                        </div>

                        <div className="stats">

                            <div>
                                <b>01</b>

                                <small>
                                    Trusted Sourcing
                                </small>
                            </div>

                            <div>
                                <b>02</b>

                                <small>
                                    Global Shipping
                                </small>
                            </div>

                            <div>
                                <b>03</b>

                                <small>
                                    Business Support
                                </small>
                            </div>

                        </div>

                    </div>

                    <div className="heroImg">

                        <img
                            src="/images/zosha-banner.jpg"
                            alt="ZOSHA"
                        />

                    </div>

                </div>
            </section>

            <section
                id="about"
                className="section"
            >
                <div className="container split">

                    <div>

                        <p className="eyebrow">
                            ABOUT ZOSHA
                        </p>

                        <h2>
                            Making International
                            Trade Simple.
                        </h2>

                        <p>
                            We help businesses
                            source products from
                            China and navigate
                            the journey from
                            supplier selection
                            to international
                            delivery.
                        </p>

                        <p>
                            Our focus is reliable
                            sourcing, transparent
                            communication, quality
                            products and practical
                            trade solutions.
                        </p>

                    </div>

                    <div className="promise">

                        <ShieldCheck />

                        <h3>
                            Built on Trust
                        </h3>

                        <p>
                            Professional support
                            designed to give
                            buyers confidence at
                            every step.
                        </p>

                        <hr />

                        <div>
                            <Globe2 />

                            China sourcing &
                            worldwide business
                            support
                        </div>

                    </div>

                </div>
            </section>

            <section
                id="services"
                className="section light"
            >
                <div className="container">

                    <p className="eyebrow center">
                        WHAT WE DO
                    </p>

                    <h2 className="center">
                        Our Services
                    </h2>

                    <div className="cards">

                        {services.map(
                            ([Icon, title, description]) => (
                                <article
                                    className="card"
                                    key={title}
                                >
                                    <Icon />

                                    <h3>
                                        {title}
                                    </h3>

                                    <p>
                                        {description}
                                    </p>

                                    <button
                                        onClick={() =>
                                            go(
                                                "contact"
                                            )
                                        }
                                    >
                                        Enquire

                                        <ArrowRight
                                            size={15}
                                        />
                                    </button>
                                </article>
                            )
                        )}

                    </div>

                </div>
            </section>

            <section
                id="products"
                className="section"
            >
                <div className="container">

                    <div className="head">

                        <div>

                            <p className="eyebrow">
                                PRODUCT CATALOGUE
                            </p>

                            <h2>
                                Explore Our Products
                            </h2>

                        </div>

                        <div className="filters">

                            <label>
                                <Search
                                    size={16}
                                />

                                <input
                                    value={q}
                                    onChange={(event) =>
                                        setQ(
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                    placeholder="Search products"
                                />
                            </label>

                            <select
                                value={cat}
                                onChange={(event) =>
                                    setCat(
                                        event
                                            .target
                                            .value
                                    )
                                }
                            >
                                {categories.map(
                                    (category) => (
                                        <option
                                            key={
                                                category
                                            }
                                            value={
                                                category
                                            }
                                        >
                                            {category}
                                        </option>
                                    )
                                )}
                            </select>

                        </div>

                    </div>

                    {loadingProducts && (
                        <p>
                            Loading products...
                        </p>
                    )}

                    {productError && (
                        <p>
                            Unable to load
                            products. Please try
                            again later.
                        </p>
                    )}

                    {!loadingProducts &&
                        !productError &&
                        shownProducts.length ===
                            0 && (
                            <p>
                                No products found.
                            </p>
                        )}

                    <div className="products">

                        {shownProducts.map(
                            (product) => (
                                <article
                                    className="product"
                                    key={
                                        product.id
                                    }
                                >

                                    <div className="pimg">

                                        <img
                                            src={
                                              product.imageUrl
                                                  ? `${API_URL}${product.imageUrl}`
                                                              : "/images/product-1.svg"
                                                }
                                            alt={
                                                product.name
                                            }
                                        />

                                        {product.categoryName && (
                                            <span>
                                                {
                                                    product.categoryName
                                                }
                                            </span>
                                        )}

                                    </div>

                                    <div>

                                        <h3>
                                            {
                                                product.name
                                            }
                                        </h3>

                                        <p>
                                            {
                                                product.description
                                            }
                                        </p>

                                        <button
                                            onClick={() => {
                                                setEnquiry(
                                                    (
                                                        previous
                                                    ) => ({
                                                        ...previous,
                                                        product:
                                                            product.name
                                                    })
                                                );

                                                go(
                                                    "contact"
                                                );
                                            }}
                                        >
                                            Get a Quote

                                            <ArrowRight
                                                size={
                                                    15
                                                }
                                            />
                                        </button>

                                    </div>

                                </article>
                            )
                        )}

                    </div>

                </div>
            </section>

            <section
                id="why"
                className="section dark"
            >
                <div className="container">

                    <p className="eyebrow">
                        WHY CHOOSE US
                    </p>

                    <h2>
                        Better Products.
                        Bigger Opportunities.
                    </h2>

                    <div className="why">

                        {[
                            [
                                "01",
                                "Trusted Sourcing",
                                "Practical supplier and product sourcing support."
                            ],
                            [
                                "02",
                                "Competitive Pricing",
                                "Solutions focused on value and long-term business."
                            ],
                            [
                                "03",
                                "Transparent Process",
                                "Clear communication throughout your trade journey."
                            ]
                        ].map(
                            (item) => (
                                <div
                                    key={
                                        item[0]
                                    }
                                >
                                    <b>
                                        {
                                            item[0]
                                        }
                                    </b>

                                    <h3>
                                        {
                                            item[1]
                                        }
                                    </h3>

                                    <p>
                                        {
                                            item[2]
                                        }
                                    </p>
                                </div>
                            )
                        )}

                    </div>

                </div>
            </section>

            <section
                id="contact"
                className="section"
            >
                <div className="container split">

                    <div>

                        <p className="eyebrow">
                            LET'S CONNECT
                        </p>

                        <h2>
                            Tell Us What You Need.
                        </h2>

                        <p>
                            Share your product
                            requirement and
                            we'll help you
                            explore the right
                            sourcing solution.
                        </p>

                        <div className="contactInfo">

                            <a href="tel:+910000000000">
                                <Phone />

                                +91 XXXXX XXXXX
                            </a>

                            <a href="mailto:info@zoshatraders.com">
                                <Mail />

                                info@zoshatraders.com
                            </a>

                            <div>
                                <MapPin />

                                China /
                                International
                                Trade
                            </div>

                        </div>

                        <a
                            className="wa"
                            href="https://wa.me/910000000000"
                            target="_blank"
                            rel="noreferrer"
                        >
                            <MessageCircle />

                            WhatsApp Us
                        </a>

                    </div>

                    <form
                        aria-label="Product enquiry form"
                        onSubmit={
                            handleEnquirySubmit
                        }
                    >

                        <input
                            name="customerName"
                            required
                            placeholder="Your Name"
                            value={
                                enquiry.customerName
                            }
                            onChange={
                                handleEnquiryChange
                            }
                        />

                        <input
                            name="phone"
                            placeholder="Phone Number"
                            value={
                                enquiry.phone
                            }
                            onChange={
                                handleEnquiryChange
                            }
                        />

                        <input
                            name="email"
                            type="email"
                            placeholder="Email Address"
                            value={
                                enquiry.email
                            }
                            onChange={
                                handleEnquiryChange
                            }
                        />

                        <input
                            name="product"
                            placeholder="Product / Requirement"
                            value={
                                enquiry.product
                            }
                            onChange={
                                handleEnquiryChange
                            }
                        />

                        <textarea
                            name="message"
                            required
                            rows="5"
                            placeholder="Tell us about your requirement"
                            value={
                                enquiry.message
                            }
                            onChange={
                                handleEnquiryChange
                            }
                        />

                        <button
                            className="btn gold"
                            type="submit"
                            disabled={
                                enquirySending
                            }
                        >
                            {enquirySending
                                ? "Sending..."
                                : "Send Enquiry"}

                            {!enquirySending && (
                                <ArrowRight />
                            )}
                        </button>

                    </form>

                </div>
            </section>

            <footer>

                <div className="container foot">

                    <div>

                        <b>ZOSHA</b>

                        <small>
                            International Traders
                        </small>

                        <p>
                            © 2026 ZOSHA
                            International Traders.
                            All rights reserved.
                        </p>

                    </div>

                    <div>

                        <button
                            onClick={() =>
                                go("about")
                            }
                        >
                            About
                        </button>

                        <button
                            onClick={() =>
                                go("services")
                            }
                        >
                            Services
                        </button>

                        <button
                            onClick={() =>
                                go("products")
                            }
                        >
                            Products
                        </button>

                        <button
                            onClick={() =>
                                go("contact")
                            }
                        >
                            Contact
                        </button>

                    </div>

                    <p className="developer-credit">
                        Website Designed &amp;
                        Developed by

                        <a
                            href="https://mail.google.com/mail/?view=cm&fs=1&to=ansarihasan13@gmail.com"
                            target="_blank"
                            rel="noreferrer"
                        >
                            <br />

                            <strong>
                                Rashid Shaikh
                            </strong>

                            <br />

                            <span>
                                ansarihasan13@gmail.com
                            </span>
                        </a>
                    </p>

                </div>

            </footer>

        </div>
    );
}

function App() {
    return (
        <Routes>

            <Route
                path="/admin"
                element={
                    <AdminLogin />
                }
            />

            <Route
                path="*"
                element={
                    <CustomerWebsite />
                }
            />

        </Routes>
    );
}

export default App;