const apiUrl = 'https://fakestoreapi.com/products';

let products = [];

let currentPage = 1;

const itemsPerPage = 10;

async function fetchData() {

    try {

        const response = await fetch(apiUrl);

        products = await response.json();

        if (!response.ok) {

            throw new Error('Network response was not ok');

        }

        console.log("Fetched data", products);

        renderPage(products, currentPage);

        generatePaginationButtons();

    } catch (error) {

        console.error('Error fetching data:', error);

        productData([]);

    }

}

function renderPage(products, page) {

    const startIndex = (page - 1) * itemsPerPage;

    const endIndex = startIndex + itemsPerPage;

    const paginatedProducts = products.slice(startIndex, endIndex);

    productData(paginatedProducts);

    updatePaginationButtons(page);

}

function productData(products) {

    const productContainer = document.getElementById("product-wrapper");

    if (products.length == 0) {

        productContainer.innerHTML = `<div class="shimmer">

                                        <div class="image-card animate"></div>

                                        <div class="animate title"></div>

                                    </div>`;

    } else {

        productContainer.innerHTML = '';

        products.forEach((product) => {

            console.log("product price", product.price);

            const card = document.createElement('div');

            card.classList.add("product-card");

            card.innerHTML = `<a href="#">

                                <img src="${product.image}" alt="${product.title}" />

                              </a>

                              <div class="title">${product.title}</div>

                              <div class="price">${product.price}</div>`;

            productContainer.appendChild(card);

        });

    }

}

function sortProducts(direction) {

    console.log("sorting direction", direction);

    let sortedProducts = [...products];

    if (direction === 'low-high') {

        sortedProducts.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));

        console.log("low-high", sortedProducts);

    } else if (direction === 'high-low') {

        sortedProducts.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));

        console.log("high-low", sortedProducts);

    }

    renderPage(sortedProducts, currentPage);

}

// Event listener for the select dropdown

document.getElementById("sort-price").addEventListener("change", (e) => {

    sortProducts(e.target.value);

});

// Pagination logic

document.getElementById("next-page").addEventListener("click", () => {

    const totalPages = Math.ceil(products.length / itemsPerPage);

    if (currentPage < totalPages) {

        currentPage++;

        renderPage(products, currentPage);

    }

});

document.getElementById("prev-page").addEventListener("click", () => {

    if (currentPage > 1) {

        currentPage--;

        renderPage(products, currentPage);

    }

});

function updatePaginationButtons(page) {

    const totalPages = Math.ceil(products.length / itemsPerPage);

    // Update "Previous" and "Next" button state

    document.getElementById("prev-page").disabled = page === 1;

    document.getElementById("next-page").disabled = page === totalPages;

    // Update the page number buttons state

    const pageButtons = document.querySelectorAll("#page-numbers button");

    pageButtons.forEach((button) => {

        const pageNum = parseInt(button.textContent, 10);

        button.classList.remove("active");

        if (pageNum === page) {

            button.classList.add("active");

        }

    });

}

function generatePaginationButtons() {

    const totalPages = Math.ceil(products.length / itemsPerPage);

    const pageNumbersContainer = document.getElementById("page-numbers");

    pageNumbersContainer.innerHTML = ''; // Clear existing page numbers

    for (let i = 1; i <= totalPages; i++) {

        const pageButton = document.createElement("button");

        pageButton.textContent = i;

        pageButton.classList.add("page-button");

       

        // Highlight the current page

        if (i === currentPage) {

            pageButton.classList.add("active");

        }

        // Add event listener to jump to the selected page

        pageButton.addEventListener("click", () => {

            currentPage = i;

            renderPage(products, currentPage);

        });

        pageNumbersContainer.appendChild(pageButton);

    }

    // Update the "Previous" and "Next" button states based on the current page

    updatePaginationButtons(currentPage);

}

document.addEventListener('DOMContentLoaded', () => {

    fetchData();

});