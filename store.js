
const container = document.querySelector("#productcontainer");
container.innerHTML = "";

let cart = [];


    function rendercart() {
        const cartcontainer = document.querySelector("#cartcontainer");
        cartcontainer.innerHTML = "";

        const grandtotal = cart.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);

        const subtotal = document.querySelector("#subtotal");
        subtotal.textContent = `Subtotal: Rs. ${grandtotal}`;
        const delivery = 200;
        const finaltotal = grandtotal + delivery;
        const carttotal = document.querySelector("#carttotal");
        carttotal.textContent = `Grand Total: Rs. ${finaltotal}`;

        cart.forEach(item => {
            const cartitem = document.createElement("div");
            cartitem.classList.add("cart-item");
            const cartimg = document.createElement("img");

            cartimg.src = item.image;
            cartimg.alt = item.name;

            cartinfo = document.createElement("div");
            cartinfo.classList.add("cart-info");
            const name = document.createElement("p");
            const price = document.createElement("p");
            const quantity = document.createElement("p");
            const itemtotal = document.createElement("p");
            const removebtn = document.createElement("button");

            name.textContent = item.name;
            price.textContent = item.price;
            quantity.textContent = `quantity: ${item.quantity}`;
            itemtotal.textContent = `item total: ${item.price * item.quantity}`;
            removebtn.textContent = "remove";

            removebtn.addEventListener("click", () => {
                removefromcart(item.id);
            });

            cartinfo.append(name);
            cartinfo.append(price);
            cartinfo.append(quantity);
            cartinfo.append(itemtotal);
            
            cartitem.append(cartimg)
            cartitem.append(cartinfo);
            cartitem.append(removebtn);

            cartcontainer.append(cartitem);
        });
    }

    function removefromcart(productid) {
              const updatecart = cart.filter(item => item.id !== productid);  
              cart = updatecart;
              rendercart(); 
            }

            function renderproducts(products) {
                const productcontainer = document.querySelector("#productcontainer");
                productcontainer.innerHTML = "";

                products.forEach((product) => {

        const card = document.createElement("div");
        card.classList.add("product-card");
        const title = document.createElement("h3");
        const price = document.createElement("p");
        const img = document.createElement("img");
        const category = document.createElement("p");
        const addbutton = document.createElement("button");

        
        addbutton.addEventListener("click", () => {
            console.log("click button");
         const cartproduct = {
            id: product.id,
            name: product.title,
            price: Number(product.priceRange.maxVariantPrice.amount),
            image: product.featuredImage.url,
            quantity: 1
         };

         const existingproduct = cart.find (item => item.id === product.id);
         if (existingproduct) {
            if (existingproduct.quantity < 5) {
                existingproduct.quantity++;
                console.log("Quantity increased:", existingproduct.quantity);
            } else {
                console.log("Only 5 products are Avalaible");
            }
         } else {
            cart.push(cartproduct);
             console.log("New product added");
         }
         console.log(cart);
         rendercart();
        })

        title.textContent = product.title;
        price.textContent = product.priceRange.maxVariantPrice.amount;
        img.src =product.featuredImage.url;
        category.textContent = product.category.name;
        addbutton.textContent = "Add to Cart";

        card.append(title);
        card.append(price);
        card.append(img);
        card.append(category);
        card.append(addbutton);
        productcontainer.append(card);
    
    });
}
    const checkbtn = document.querySelector("#checkbtn");
    const checkoutform = document.querySelector("#checkoutform");

   checkbtn.addEventListener("click", () => {
    if(cart.length === 0) {
        alert("please select the product");
    } else {
        checkoutform.style.display = "flex";
    }
   })

   const customername = document.querySelector("#customername");
   const customeremail = document.querySelector("#customeremail");
   const customeraddress = document.querySelector("#customeraddress");
   const orderbtn = document.querySelector("#orderbtn");

   orderbtn.addEventListener("click", (event) => {
    event.preventDefault();

    const paymentmethod = document.querySelector(`input[name="payment"]:checked`);

    if (
        customername.value === ""  ||   
    !customeremail.value.includes("@") ||
    !customeremail.value.includes(".") ||    
    customeraddress.value === "" ||
    !paymentmethod
    ) {
        alert("Pleasse complete all fields");
    } else {
        alert("order place successfully");
        cart = [];
        checkoutform.reset();
    }
   });

   const query = `{
    products(first: 20) {
        nodes {
            id
            title
            priceRange {
            maxVariantPrice {
            amount
           } 
         } featuredImage {
          url
          } category {
           name }
     }
    }
   }`;

   const checking = `{
    __type(name: "TaxonomyCategory") {
    fields{ 
    name
    }
    }
   }`;

   let apiproducts = [];
   let categoryfilter;
   let searchproduct;
   
   function filterproducts() {
    const searchtext = searchproduct.value.trim().toLowerCase();
    const selectedcategory = categoryfilter.value;
    const matchingproducts = apiproducts.filter(product => {
        return product.title.toLowerCase().includes(searchtext) &&
        (selectedcategory === "All Products" ||
            product.category.name === selectedcategory);
    });
    renderproducts(matchingproducts);
   }

async function getdata() {
    let response = await fetch("https://mock.shop/api", {
    method: "POST",
    headers: { "Content-Type": "application/json"},
    body: JSON.stringify ({
        query: query
    }) 
    });
    const data = await response.json();
    console.log(data);
    apiproducts = data.data.products.nodes;

    renderproducts(apiproducts);

    const categories = new Set (
    apiproducts.map (product => product.category.name)
    );

     categoryfilter = document.querySelector("#categoryfilter");

     categories.forEach(category => {
        const option = document.createElement("option");
        option.textContent = category;
        categoryfilter.append(option);
     });

       categoryfilter.addEventListener("change", () => {
        filterproducts();
       })

     searchproduct = document.querySelector("#searchproduct");
    const searchbtn = document.querySelector("#searchbtn");

    searchbtn.addEventListener("click", () => {
      filterproducts()
    });
}
getdata();

