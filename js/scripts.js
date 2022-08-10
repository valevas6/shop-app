fetch('https://dummyjson.com/products')
.then(res => res.json())
.then(json => mainFunc(json));


// Main function
function mainFunc(data) {
    const select = document.getElementById('categories');
    let selectCategory = null;
    if(select) {
        select.addEventListener('change', function handleChange(event) {
            selectCategory =  event.target.value;
            addProducts(data, selectCategory);
        });
    }
    addProducts(data, selectCategory);
    addCategories(data);
    addAccordionItems(data);
    addNewArrivalsItems(data);
    loadModal();
    loadQuantity();
}

// Add products
function addProducts(data, selectCategory) {
    let totalProd = data.products;
    let count = 0; 
    if(document.getElementById("products")){
        document.getElementById("products").innerHTML='';
    }
    totalProd.forEach(element => {
        count++;
        
        if(!selectCategory || selectCategory == "all-products" || selectCategory == "popular-items") {
            if(document.URL.indexOf("index") >-1 && count < 9 ) {
                addSingleProduct(element);
            } else if (!(document.URL.indexOf("index") >-1)){
                addSingleProduct(element);
            }
        }
         else if (selectCategory == element.category) {
            addSingleProduct(element);
        }
    });
}

function myFunction(id, price, title) {
    let quantity = 1;
    let items = JSON.parse(localStorage.getItem('itemsArray')) || [];
    let item = items.find(item => item.id === id);
    if (item) {
        item.quantity += quantity;
    } else {
        items.push({
        id,
        title,
        price,
        quantity
        })
    }
    localStorage.setItem('itemsArray', JSON.stringify(items));
    loadProductFromLS();
    loadQuantity();
}

// Add a single product
function addSingleProduct(element) {
    var div = document.createElement("div");
    div.className = 'col mb-5'
    div.innerHTML = "<div class='card h-100'>" +
        "<img class='card-img-top card-product' src="+element.thumbnail+" alt='...' />"+
        "<div class='card-body p-4'>"+
            "<div class='text-center'>"+
                "<h5 class='fw-bolder'>"+element.title+"</h5>$"+
                +element.price+
            "</div>"+
        "</div>"+
        "<div class='card-footer p-4 pt-0 border-top-0 bg-transparent'>"+
            "<div class='text-center'><a class='btn btn-outline-dark mt-auto' id='addToCart' onclick='myFunction("+element.id+','+element.price+','+'"'+element.title+'"'+")'>Add to cart</a></div>"+
        "</div>"+
    "</div>";

    if(document.getElementById("products")){
        document.getElementById("products").appendChild(div);
    } 
}

// Add dropdown categories 
function addCategories(data) {
    let totalProd = data.products;
    let arrayOption = [];
    totalProd.forEach(element => {
        arrayOption.push(element.category);
    });
    const filteredArray = arrayOption.filter(function(ele , pos){
        return arrayOption.indexOf(ele) == pos;
    }) 
    filteredArray.forEach(element => {
        var option = document.createElement("option");
        option.innerHTML = element;
        option.value = element;
        if(document.getElementById("categories")){
            document.getElementById("categories").appendChild(option);
        } 
    });
}


function addAccordionItems(data) {
    let totalProd = data.products;
    let count = 0;

    totalProd.forEach(element => {
        if(count < 9) {
            var div = document.createElement("div");
            div.className = 'accordion-item '
            div.innerHTML =  "<h2 class='accordion-header' id='heading'"+count+">"+
            "<button class='accordion-button collapsed' type='button' data-bs-toggle='collapse' data-bs-target='#collapse"+count+"' aria-expanded='false' aria-controls='collapse"+count+"'>"+
              element.title+
            '</button>'+
          '</h2>'+
          "<div id='collapse"+count+"' class='accordion-collapse collapse' aria-labelledby='heading"+count+"' data-bs-parent='#accordionExample'>"+
            "<div class='accordion-body row'>"+
            "<div class='col mb-11'>"+
              '<p><strong>Category: </strong>'+element.category+'<p/>'+
              '<p><strong>Description: </strong>'+element.description+'<p/>'+
              '<p> <strong>Price:</strong> $'+element.price+'<p/>'+
              "<div>"+
              "<a class='btn btn-outline-dark mt-auto' id='addToCart' onclick='myFunction("+element.id+','+element.price+','+'"'+element.title+'"'+")'>Add to cart</a>"+
              "</div>"+
              "</div>"+
              "<div class='col mb-1 img-acc'>"+
              "<img class='card-img-top card-product' src="+element.thumbnail+" alt='...' />"+
              "</div>"+
              '</div>'+
          '</div>';
          count++;
        
            if(document.getElementById("accordionItems")){
                document.getElementById("accordionItems").appendChild(div);
            } 
        }
    });
}

function addNewArrivalsItems(data) {
    let totalProd = data.products;
    totalProd.forEach(element => {
        if(element.id > 22) {
            console.log(element);
            var div = document.createElement("div");
            div.className = 'col mb-5'
            div.innerHTML = "<div class='card h-100'>" +
                "<img class='card-img-top card-product' src="+element.thumbnail+" alt='...' />"+
                "<div class='card-body p-4'>"+
                    "<div class='text-center'>"+
                        "<h5 class='fw-bolder'>"+element.title+"</h5>$"+
                        +element.price+
                    "</div>"+
                "</div>"+
                "<div class='card-footer p-4 pt-0 border-top-0 bg-transparent'>"+
                    "<div class='text-center'><a class='btn btn-outline-dark mt-auto' id='addToCart' onclick='myFunction("+element.id+','+element.price+','+'"'+element.title+'"'+")'>Add to cart</a></div>"+
                "</div>"+
                "</div>";
            if(document.getElementById("new-arrivals-prod")){
                document.getElementById("new-arrivals-prod").appendChild(div);
            }
        }
    });
}
// Payment form validation
(function () {
    'use strict'
    var forms = document.querySelectorAll('.needs-validation')
    Array.prototype.slice.call(forms)
      .forEach(function (form) {
        form.addEventListener('submit', function (event) {
          if (!form.checkValidity()) {
            event.preventDefault()
            event.stopPropagation()
          } else {
            localStorage.clear();
            loadProductFromLS();
            loadQuantity();
            alert('Payment processed. Thanks for your order!')
          }
          form.classList.add('was-validated')
        }, false)
      })
  })()

function loadModal() {
    var div = document.createElement("div");
    div.className = 'modal-dialog';
    div.role = 'document'
    div.innerHTML = "<div class='modal-content'>"+
    "<div class='modal-header'>"+
      "<h5 class='modal-title' id='exampleModalLabel'>Cart</h5>"+
      "<button type='button' class='close' data-dismiss='modal' aria-label='Close'>"+
        "<span aria-hidden='true'>&times;</span>"+
      "</button>"+
    "</div>"+
    "<div class='modal-body' id='modal-body'>"+
    "</div>"+
    "<div class='modal-footer'>"+
      "<button type='button' class='btn btn-secondary' data-dismiss='modal'>Close</button>"+
      "<a type='button' href='payment.html' class='btn btn-outline-dark'>Payment</a>"+
    "</div>"+
  "</div>";

    if (document.getElementById("exampleModal")){
        document.getElementById("exampleModal").appendChild(div);
        loadProductFromLS();
    } 
}

function addProduct(id){
    let quantity = 1;
    let items = JSON.parse(localStorage.getItem('itemsArray')) || [];
    let item = items.find(item => item.id === id);
    if (item) {
        item.quantity += quantity;
    } 
    localStorage.setItem('itemsArray', JSON.stringify(items));
    loadProductFromLS();
    loadQuantity();
}

function removeProduct(id){
    let quantity = 1;
    let items = JSON.parse(localStorage.getItem('itemsArray')) || [];
    let item = items.find(item => item.id === id);
    if (item) {
        if (item.quantity > 1 ) {
            item.quantity -= quantity;
        } else {
            for (var i=0; i< items.length; i++) {
                var product = items[i];
                if (product.id == id) {
                    items.splice(i, 1);
                }
            }
        }   
    } 
    localStorage.setItem('itemsArray', JSON.stringify(items));
    loadProductFromLS();
    loadQuantity();
}

function loadQuantity() {
    let quantity=0;
    let items = JSON.parse(localStorage.getItem('itemsArray')) || [];
    items.forEach(element => {
        quantity = element.quantity + quantity;
    });

    if (document.getElementById("cart")){
        document.getElementById("cart").innerHTML = quantity;
    } 
}

function loadProductFromLS() {
    if(document.getElementById("modal-body")){
        document.getElementById("modal-body").innerHTML = "";
    }  
    let items = JSON.parse(localStorage.getItem('itemsArray')) || [];
    items.forEach(element => {
        cartTotal =+ element.quantity;
        let div = document.createElement("div");
        div.className = "cartItem row";
        div.innerHTML= "<strong class='col mb-3'>"+element.title+"</strong>"+
        "<p class='col mb-3'>Price: $"+element.price+"</p>"+
        "<div class='col mb-6 item-quantity'>"+
            "<a type='button' onclick=addProduct("+element.id+") class='btn btn-outline-dark'>+</a>"+
            "<p class='text-end '>"+element.quantity+"</p>"+
            "<a type='button' onclick=removeProduct("+element.id+") class='btn btn-outline-dark' >-</a>"+
        "</div>";

        if(document.getElementById("modal-body")){
            document.getElementById("modal-body").appendChild(div);
        } 
    });
}

