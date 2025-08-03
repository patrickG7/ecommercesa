const productContainer = document.querySelector(".product-list");
const productDetailContainer = document.querySelector(".product-detail")
const isCartPage = document.querySelector(".cart");


if(productContainer){
    displayProduct();
    console.log('displayProduct()')
}else if(productDetailContainer){
    displayProductDetail();
    console.log('displayProductDetail()')
}else if(isCartPage){
    displayCart();
    console.log('displayCart()')
}



function displayProduct(){ 
    products.forEach(product => {       
        const productCard = document.createElement("div");
        productCard.classList.add("product-card");
        productCard.innerHTML = `
            <div class="img-box">
                <img src="${product.colors[0].mainImage}">
            </div>  
            <h3 class="title">${product.title}<h3>          
            <p>${product.price}</p>
        `;
        productContainer.appendChild(productCard);

        const imgBox = productCard.querySelector(".img-box");
        imgBox.addEventListener("click", ()=>{
            sessionStorage.setItem("selectedProduct", JSON.stringify(product));
            window.location.href = "product-detail.html"
        });
    });   
}

function displayProductDetail(){
    const productData = JSON.parse(sessionStorage.getItem("selectedProduct"));

    const titleEl = document.querySelector(".title");
    const priceEl = document.querySelector(".price");
    const descriptionEl = document.querySelector(".description");
    const mainImageContainer = document.querySelector(".main-img");
    const thumbnailContainer = document.querySelector(".thumbnail-list");
    const sizeContainer = document.querySelector(".size-options");
    const colorContainer = document.querySelector(".color-options");
    const addToCartBtn = document.querySelector("#addToCart");

    let selectedColor = productData.colors[0];
    let selectedSize = selectedColor.sizes[0];

    function updateProductDetail(colorData){
        if(!colorData.sizes.includes(selectedSize)){
            selectedSize = colorData.sizes[0];
        }

        mainImageContainer.innerHTML = `<img src="${colorData.mainImage}">`;

        thumbnailContainer.innerHTML = "";
        const allThumbnails = [colorData.mainImage].concat(colorData.thumbnails.slice(0,3));
        allThumbnails.forEach(thumb =>{
            const img = document.createElement("img");            
            img.src = thumb;

            thumbnailContainer.appendChild(img);

            img.addEventListener("click", () =>{
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
                updateProductDetail(color)
            });
        });

        sizeContainer.innerHTML = "";
        colorData.sizes.forEach(size =>{
            const btn = document.createElement("button");
            btn.textContent = size;

            if(size === selectedSize) btn.classList.add("selected");

            sizeContainer.appendChild(btn);

            btn.addEventListener("click", ()=> {
                document.querySelectorAll(".size-options button").forEach(el=> el.classList.remove("selected"));
                btn.classList.add("selected");
                selectedSize = size;
            });
        });
    }
    titleEl.textContent = productData.title;
    priceEl.textContent = productData.price;
    descriptionEl.textContent = productData.description;

    updateProductDetail(selectedColor)   

    addToCartBtn.addEventListener("click", ()=>{
        addToCart(productData, selectedColor, selectedSize);
    });
}

function addToCart(product, color, size){
    let cart = JSON.parse(sessionStorage.getItem("cart")) || [];    
    console.log(cart)
    const existingItems = cart.find(item => item.id === product.id && item.color === color.name && item.size === size);

    if(existingItems){
        existingItems.quantity += 1;
    }else{
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
    cartItemCounter();
}

function displayCart(){
    const cart = JSON.parse(sessionStorage.getItem("cart")) || [];    

    const cartItemsContainer = document.querySelector(".cart-items");
    const subtotalEl = document.querySelector(".subtotal");
    const grandTotalEl = document.querySelector(".grand-total");

    cartItemsContainer.innerHTML = "";

    if(cart.length === 0){
        cartItemsContainer.innerHTML = "<p>Your Cart is empty</p>";
        subtotalEl.textContent = "$0";
        grandTotalEl.textContent = "$0";
        return;
    }

    let subtotal = 0;    

    cart.forEach((item, index)=>{
        const itemTotal = parseFloat(item.price.replace("$", "")) * item.quantity;
        subtotal += itemTotal;
        console.log(cart)

        const cartItem = document.createElement("div");
        cartItem.classList.add("cart-item");
        cartItem.innerHTML  = `
             <div class="product">                
                <img src="${item.image}" alt="">
                <div class="item-detail">
                    <p class="title">${item.title}</p>
                    <div class="size-color-box">                        
                        <span class="size">${item.size}</span>
                        <span class="color">${item.color}</span>
                    </div>
                </div>                                    
            </div>
            <span class="price">${item.price}</span>
            <span class="quantity"><input type="number"  value="${item.quantity}" data-index="${index}" min="1"></span>
            <span class="total-items">${itemTotal}</span>
            <button class="remove" data-index="${index}">x</button>                  
        `;
        cartItemsContainer.appendChild(cartItem);
    });

    subtotalEl.textContent = `${subtotal.toFixed(2)}`;
    grandTotalEl.textContent = `${subtotal.toFixed(2)}`;
    updateQuantity();
    removeItem();
}

function removeItem(){
    document.querySelectorAll(".remove").forEach(button =>{
        button.addEventListener("click", function(){
            let cart = JSON.parse(sessionStorage.getItem("cart")) || [];
            const index = this.getAttribute("data-index");
            cart.splice(index, 1);

            sessionStorage.setItem("cart", JSON.stringify(cart));
            displayCart();
            cartItemCounter();
        });
    });
}

function updateQuantity(){
    document.querySelectorAll(".quantity input").forEach(input =>{
        input.addEventListener("change", function(){
            let cart = JSON.parse(sessionStorage.getItem("cart")) || [];
            const index = this.getAttribute("data-index");
            cart[index].quantity = parseInt(this.value);

            sessionStorage.setItem("cart", JSON.stringify(cart));
            displayCart();
            cartItemCounter();
        });
    });
}

function cartItemCounter(){
    const cart = JSON.parse(sessionStorage.getItem("cart")) || [];

    const cartCount = cart.reduce((total, item)=> total+item.quantity, 0);
    const badge = document.querySelector(".cart-item-counter");

    if(badge){
        if(cartCount > 0){
            badge.textContent = cartCount;
            badge.style.display = "block";
        }else{
            badge.style.display = "none";
        }
    }
}

cartItemCounter();
 



