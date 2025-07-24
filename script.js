const productContainer = document.querySelector(".product-list");
const isProductDetail = document.querySelector(".product-detail");
const cart = document.querySelector(".cart");


if(productContainer){
    displayProduct();
}else if(isProductDetail){
    displayProductDetail();
}else if(cart){
    displayCart();
}


function displayProduct(){
    products.forEach(product =>{
        const productCard = document.createElement("div");
        productCard.classList.add("product-card");
        productCard.innerHTML = `
            <div class="img-box">
                <img src="${product.colors[0].mainImage}">
            </div>
            <h3>${product.title}</h3>
            <p>${product.price}</p>
        `;
        productContainer.appendChild(productCard);

        const imgBox = productCard.querySelector(".img-box");
        imgBox.addEventListener("click", ()=>{
            sessionStorage.setItem("selectedProduct", JSON.stringify(product));
            window.location.href = "product-details.html";            
        });

    });
}

function displayProductDetail(){
    const productData = JSON.parse(sessionStorage.getItem("selectedProduct"));
    
    const titleEL = document.querySelector(".title");
    const priceEL = document.querySelector(".price");
    const descriptionEL = document.querySelector(".description");
    const mainImageContainer = document.querySelector(".main-img");
    const thumbnailContainer = document.querySelector(".thumbnail-list");
    const sizeContainer = document.querySelector(".size-options");
    const colorContainer = document.querySelector(".color-options");
    const addToCartBtn = document.querySelector("#add-to-cart");

    let selectedColor = productData.colors[0];
    let selectedSize = selectedColor.sizes[0];

    function updateProductDetails(colorData){
          if(!colorData.sizes.includes(selectedSize)){
            selectedSize = colorData.sizes[0];
        }

        mainImageContainer.innerHTML = `<img src="${colorData.mainImage}">`;

        thumbnailContainer.innerHTML = "";
        const allThumbnails = [colorData.mainImage].concat(colorData.thumbnails.slice(0, 3));
        allThumbnails.forEach(thumb =>{
            const img = document.createElement("img");
            img.src = thumb;     

            thumbnailContainer.appendChild(img);

            img.addEventListener("click", ()=>{
                mainImageContainer.innerHTML = `<img src="${thumb}">`;
            });
        });

        colorContainer.innerHTML = "";
        productData.colors.forEach(color =>{
            const img = document.createElement("img");
            img.src = color.mainImage;
            if(color.name === colorData.name) img.classList.add("selected");

            colorContainer.appendChild(img);

            img.addEventListener("click", ()=>{
                selectedColor = color;
                updateProductDetails(color);
            });
        });

        sizeContainer.innerHTML = "";
        colorData.sizes.forEach(size =>{
            const btn = document.createElement("button");
            btn.textContent = size;
            if(size === selectedSize) btn.classList.add("selected");

            sizeContainer.appendChild(btn);

            btn.addEventListener("click", ()=>{
                document.querySelectorAll(".size-options button").forEach(el =>el.classList.remove("selected"));
                btn.classList.add("selected");
                selectedSize = size;
            });
        });
    }
    titleEL.textContent = productData.title;
    priceEL.textContent = productData.price;
    descriptionEL.textContent = productData.description;
    updateProductDetails(selectedColor)

    addToCartBtn.addEventListener("click", ()=>{
        addToCart(productData, selectedColor, selectedSize)
        console.log(addToCart)
    })
}

function addToCart(product, color, size){
    let cart = JSON.parse(sessionStorage.getItem("cart")) || [];

    const existingItem = cart.find(item=> item.id === product.id && item.color === color.name && item.size === size);

    if(existingItem){
        existingItem.quantity += 1;
    }else {
        cart.push({
            id: product.id,
            title: product.title,
            price: product.price,
            image: color.mainImage,
            color: color.name,
            size: size,
            quantity: 1
        });
    }
    sessionStorage.setItem("cart", JSON.stringify(cart));
    updateCartBadge();
}

function displayCart(){
    const  cart = JSON.parse(sessionStorage.getItem("cart")) || [];       

    const cartItemsContainer = document.querySelector(".cart-items");
    const subTotalEl = document.querySelector(".subtotal");
    const grandTotalEl = document.querySelector(".grand-total");

    cartItemsContainer.innerHTML = "";

    if(cart.length === 0){
        cartItemsContainer.innerHTML = "<p> Your cart is empty</p>";
        subTotalEl.textContent = "$0";
        grandTotalEl.textContent = "0";
        return;
    }

    let subtotal = 0;

    cart.forEach((item, index)=>{
        const itemTotal = parseFloat(item.price.replace("$", "")) * item.quantity;
        subtotal += itemTotal;

        const cartItem = document.createElement("div");
        cartItem.classList.add("cart-item");
        cartItem.innerHTML = `
            <div class="product">
                    <img src="${item.image}">
                    <div class="product-info">                     
                        <p class="title">${item.title}</p>
                        <div class="size-color-box">
                            <span class="size">${item.size}</span>
                            <span class="color">${item.color}</span>
                        </div>
                    </div>
                </div>
                <span class="price">${item.price}</span>
                <span class="quantity"><input type="number" value="${item.quantity}" data-index="${index}" min="1"></span>
                <span class="total-price">${itemTotal}</span>
                <button class="remove" data-index="${index}">x</button>
        
        `;
        cartItemsContainer.appendChild(cartItem);
    });
    subTotalEl.textContent = `${subtotal.toFixed(2)}`;
    grandTotalEl.textContent = `${subtotal.toFixed(2)}`;

    removeCartItem();
    updateQuantity();
}


function removeCartItem(){
    document.querySelectorAll(".remove").forEach(button=>{
        button.addEventListener("click", function(){
            let cart = JSON.parse(sessionStorage.getItem("cart")) || [];
            const index = this.getAttribute("data-index");
            cart.splice(index, 1);
            sessionStorage.setItem("cart", JSON.stringify(cart));
            displayCart();
            updateCartBadge();
        });
    });
}

function updateQuantity(){
    document.querySelectorAll(".quantity input").forEach(input=>{
        input.addEventListener("change", function(){
        let cart = JSON.parse(sessionStorage.getItem("cart")) || [];
            const index = this.getAttribute("data-index");
            cart[index].quantity = parseInt(this.value);
            sessionStorage.setItem("cart", JSON.stringify(cart));
            displayCart();  
            updateCartBadge();
        });
    });
}

function updateCartBadge(){
    const cart = JSON.parse(sessionStorage.getItem("cart")) || [];
    const cartCount = cart.reduce((total ,item)=> total + item.quantity, 0);
    const badge = document.querySelector(".cart-item-icon");

    if(badge){
        if(cartCount > 0){
            badge.textContent = cartCount
            badge.style.display = "block";           
        }
    }else{
            badge.style.display = "none";
    }
}

updateCartBadge();