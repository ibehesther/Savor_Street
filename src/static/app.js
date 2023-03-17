`use-strict`
// const URL='http://127.0.0.1:3000';
const URL='https://savor-street.onrender.com';
const socket = io(URL);
const msgCont = document.getElementById('data-container');
const userForm = document.getElementById('user_form');
const userInput = document.getElementById('user_input');
const container = document.querySelector('.container')
const body = document.documentElement;

const options_main = ["start", "menu", "0"]
const options_99 = ["menu", "start", "97", "0"]
const options_confirm = ['99'];

//get old messages from the server
 
//----------------------------------------------------------------------
// When a user press the enter key, send message.
const state = {current_value: 'start'};

const scrollToBottom = () => {
  body.scrollTop = body.scrollHeight;
}

const generateMssg = (user="SavorBot", input) => {
  const date = new Date(Date.now());
  let createdAt=date.toString().split(" ")[4];
  createdAt = createdAt.split("").splice(0, 5).join('');

  return {
    user,
    obj:{
      text:  `<p> ${input} </p>`
    },
    createdAt
  }
}

userForm.addEventListener('submit', async(e) => {
  e.preventDefault();
  const input = userInput.value.toLowerCase().trim();
  if(!input) return e.preventDefault();
  loadData(generateMssg("Me", input), "right");
  
  switch(input){
    case 'menu':
      replyToWelcome(input);
      break;
    case '1':
    case '98':
    case '97':
    case'0':
      if(options_main.includes(state.current_value)){
        replyToWelcome(input);
        break;
      }
      handleInvalidOption();
      break;
    case '99':
      if(options_99.includes(state.current_value) || state.current_value.match(/^m\d+/)?.input){
        replyToWelcome(input);
        break;
      }
      handleInvalidOption();
      break;
    case 'confirm':
      if(options_confirm.includes(state.current_value) || state.current_value.match(/^m\d+/)?.input){
        handleConfirmOrder();
        break;
      }
      handleInvalidOption();
      break;
    case input.match(/^m\d+/)?.input:
      if(state.current_value === '1'){
        handlePlaceOrder(input); 
        break;
      } 
    default:
      handleInvalidOption();
  }
  state.current_value= input;
  // Reset Input field
  userInput.value= '';
});
//----------------------------------------------------------------------

//----------------------------------------------------------------------
// Get user 
const getUser = async() => {
  const user_id = localStorage.getItem('user_id');
  return await fetch(`${URL}/api/users`,{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({user_id})
  })
  .then((response) => response.json())
  .then((data) => {
    localStorage.setItem('user_id', data.id);
    return data

  })
  .catch(console.log);
}

const getMenu = async() => {
  return await fetch(`${URL}/api/menu`)
  .then((response) => response.json())
  .then((data) => {
    return data
  })
  .catch(console.log);
}

const getMenuItem = async(id) => {
  let menu_item = await fetch(`${URL}/api/menu/${id}`)
  .then((response) => response.json())
  .then((data) => {
    return data
  })
  .catch(console.log);
  return menu_item
}

const createOrderItem = async(item, order, qty) => {
  const order_item = await fetch(`${URL}/api/order_items`,
  {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      order_id: order.id,
      item_id: item.id,
      quantity: qty
    })
  })
  .then((response) => response.json())
  .then((data) => {
    return data
  })
  .catch(console.log);
  return order_item;
}

const getMenuDetailsByOrderItems = async(order_items) => {
  let menu = await getMenu();
  let menu_details = [];
  order_items.map((item) => {
    let menu_item = menu.filter((itm) => itm.id === item.item_id)[0]
    menu_details.push(menu_item)
  })
  return menu_details;
}

const getOrderItemsById = async(id) => {
  const order_items = await fetch(`${URL}/api/order_items/${id}`)
  .then((response) => response.json())
  .then((data) => {
    return data
  })
  .catch(console.log);
  return order_items;
}

const getUserOrders = async() => {
  let user_id = localStorage.getItem('user_id');
  const user_orders = await fetch(`${URL}/api/orders/${user_id}`)
  .then((response) => response.json())
  .then((data) => {
    return data
  })
  .catch(console.log);
  return user_orders;
}

const getOrderDetails = async(order_items, menu_items) => {
  let order_total = 0;
  for(let item of order_items){
    let menu_item = await getMenuItem(item.item_id);
    
    order_total += menu_item.price * item.quantity;
  }

  return {order_total, order_items, menu_items}
}

const createOrder = async() => {
  let user_id = localStorage.getItem('user_id');
  let order = await fetch(`${URL}/api/orders`,{
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({user_id})
  })
  .then((response) => response.json())
  .then((data) => {
    return data
  })
  .catch(console.log);
  return order;
}

const updateOrder = async(id, body) => {
  return await fetch(`${URL}/api/orders/${id}`,{
    method: "PATCH",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })
  .then((response) => response.json())
  .then((data) => {
    return data
  })
  .catch(console.log);
}

const formatOrderItems = async(order, item_qty) => {
  let order_total = 0
  let menu = await getMenu();
  let i =0;
  let order_items = [];
  for(let item in item_qty){
    let id = item.replace('m', '')
    id = parseInt(menu[id-1].id)
    let menu_item = await getMenuItem(id);
    order_total += menu_item.price * item_qty[item];
    let order_item = await createOrderItem(menu_item, order, item_qty[item]);
    order_items.push(order_item);

    if(i === Object.keys(item_qty).length - 1){
      await updateOrder(order.id, {total_order_amount: order_total});
      return order_items;
    }
    i++;
  }
 
}

const handlePlaceOrder = async(input) => {
  const user_orders = await getUserOrders();
  if( user_orders[0] && user_orders[0].order_status === 'pending' || user_orders[0] && user_orders[0].payment_status === 'pending'){
    console.log("You still have a pending order")
   
    let order_items = await getOrderItemsById(user_orders[0].id);
    let menu_items = await getMenuDetailsByOrderItems(order_items);
    let order_details = await getOrderDetails(order_items, menu_items);
    
    user_orders[0].payment_status === 'pending' ?  order_details.paid = false:  order_details.pending = true;
    user_orders[0].order_status === 'pending' ?  order_details.pending = true:  order_details.pending = false;

    return socket.emit('handlePlaceOrder', order_details);
  }
  else if( user_orders[0] && user_orders[0].order_status !== 'pending' && user_orders[0].payment_status === 'pending'){
    const text= "Please checkout current order before placing another.<br> Select 97 to see current order <br> Select 99 to checkout order";
    return loadData(generateMssg(text))
  }
  else{
    let items = input.split(',');
    let item_qty = {};

    items.map((item) => {
      let item_arr = item.split('-');
      item_qty[item_arr[0].trim()] = item_arr[1] && item_arr[1].trim()*1 || 1
    });
    let order = await createOrder();
    let order_items = await formatOrderItems(order, item_qty);
    let menu_items = await getMenuDetailsByOrderItems(order_items);
    
    let order_details = await getOrderDetails(order_items, menu_items)
    socket.emit('handlePlaceOrder', order_details);
  }
  
}

const handleConfirmOrder = async() => {
  const user_orders = await getUserOrders();
  await updateOrder(user_orders[0].id, {order_status: "confirmed"})
  socket.emit('handleConfirmOrder')
}
 
//Display messages to the users
function loadData(data, direction='left') {
  let messages = `
  <div class='chat-container'>
  ${direction === "left" ? 
  "<img class='profile' src='./imgs/savor_street.png'>"
  : 
  ''}
  <div class="message-container ${direction}">
  `
  // messages += `<em>${data.user}</em> \n`;

  let message = data.obj;
  messages += `<p>${message.text}<p>`;
  messages += `<ul class="options-container">`;
  message.options && message.options.map((option) => {
    messages += `<li class=""> ${option} </li>`;
  })
  messages += `</ul>`;
  messages += `<p>${message.additional_text ? message.additional_text : ''}</p> <span class="date">${data.createdAt}</span>`;
  messages += '</div> </div>';

  msgCont.innerHTML += messages;
  scrollToBottom()
}

const loadMenu = (menu, direction='left') => {
  let messages = `
  <div class="chat-container">
  ${direction === "left" ? 
  "<img class='profile' src='./imgs/savor_street.png'>"
  : 
  ''}
  <div class="message-container left">
    <div class="menu-table">
      <table>
        <tr> 
          <th class="code"> Code </th>
          <th> Name </th>
          <th class='description'> Description </th>
          <th class="price"> Price &#8358; </th>
        </tr>
    `
  menu.map((item, sn) => {
    messages += `
    <tr>
      <td> m${sn + 1} </td>
      <td> ${item.name} </td>
      <td> ${item.description} </td>
      <td> ${item.price} </td>
    </tr>
    `
  })
  messages += `</table>`
  messages += `
      </div>
      <p> 
        Please select the code that matches the item you would like to order
        and the quantity seperated by a dash.<br><br>
        For example: To place an order for 2 serving(s) of '${menu[0].name}', you type "m1-2". <br><br>
        To place an order for more than one item, seperate each order item with a comma in the same format above. <br>
        For example: "m1-2,m3-1" <br><br>
        Type "menu" to go back to main menu
      </p>
    </div>
    </div>
  `
  msgCont.innerHTML += messages;
  scrollToBottom();
}

const loadOrders = (orders, direction='left') => {
  let messages = `
  <div class='chat-container'>
  ${direction === "left" ? 
  "<img class='profile' src='./imgs/savor_street.png'>"
  : 
  ''}
  <div class="message-container left">
    <div class="menu-table">
      <table>
        <tr> 
          <th> Date </th>
          <th> Order Items </th>
          <th> Total &#8358; </th>
          <th> status </th>
          <th> paid </th>
        </tr>
   `
   orders.map(async(order, sn) => {
    let order_items = await getOrderItemsById(order.id)
    let menu_items = await getMenuDetailsByOrderItems(order_items);
    let length = menu_items.length;
    let date_time = order.order_date_time
    let start = date_time.indexOf('T')
    let date = date_time.split('').splice(0,start).join('');
    
    messages += `
    <tr>
      <td rowspan="${length}"> ${date}</td>
      <td> ${menu_items[0].name} (${order_items[0].quantity}) </td>
      <td rowspan="${length}"> ${order.total_order_amount} </td>
      <td rowspan="${length}"> ${order.order_status} </td>
      <td rowspan="${length}"> ${order.payment_status==='paid' ? "Yes": "No"} </td>
    </tr>
    <tr>
      ${menu_items.filter((item, index) => index !==0 ).map((item, i) => {
        return(`<td> ${item.name} (${order_items[i+1].quantity}) </td>`)
      })}
    </tr>
    `
    if(sn === orders.length - 1){
      messages +=  `</table></div><br><p>Type "menu" to go back to main menu</p> </div> </div>`

      msgCont.innerHTML += messages;
    }
    scrollToBottom();
  })
  
  
}
 
//socket.io
socket.on('welcome', (message) => {
  let user = getUser();
  loadData(message, "left");
});

socket.on('invalidOption', (message) => {
  loadData(message)
});

socket.on('placeOrder', async() => {
  let menu = await getMenu();
  loadMenu(menu);
})

socket.on('confirmOrder',(message) => {
  loadData(message)
} )

socket.on('checkoutOrder',(message) => {
  loadData(message)
})

socket.on('payOrder',(message) => {
  loadData(message)
} )


socket.on('handleCheckOutOrder', async() => {
  const text= `Please confirm current order before checkout.<br> Type "confirm" to confirm pending order <br><br>Type "menu" to go back to main menu`
  const user_orders = await getUserOrders();
  const current_order = user_orders[0];
  
  if(current_order.order_status === 'pending') return loadData(generateMssg(text ));


  let order = await updateOrder(current_order.id, {payment_status: "paid"})
  socket.emit("handleOrderPayment", order.id)
})

socket.on('handleFetchOrderHistory', async() => {
  const orders = await getUserOrders()
  const text= `You have not placed any order, Let's fix that!.<br> Select 1 to place an order <br><br> Type "menu" to go back to main menu`
   
  if(!orders.length) return loadData(generateMssg(text), "left");

  loadOrders(orders)
})

socket.on('handleFetchCurrentOrder', async() => {
  const orders = await getUserOrders();
  const text= `No pending order.<br> Select 1 to place an order <br> Type "menu" to go back to main menu`;
  if(!orders.length) return loadData(generateMssg(text), "left")
  if(orders[0] && orders[0].order_status === "cancelled") return loadData(generateMssg(text));
  if(orders[0] && orders[0].order_status !== "pending" && orders[0].payment_status !== "pending") return loadData(generateMssg(text));
  
  let currentOrder= orders[0];
  let order_items = await getOrderItemsById(currentOrder.id);
  let menu_items = await getMenuDetailsByOrderItems(order_items);
  let order_details = await getOrderDetails(order_items, menu_items);
  socket.emit('handlePlaceOrder', order_details);
})

socket.on("handleCancelOrder", async() => {
  const orders = await getUserOrders();
  const text= `No pending order.<br> Select 1 to place an order <br><br> Type "menu" to go back to main menu`;

  if(!orders.length) return loadData(generateMssg(text))
  if(orders[0] && orders[0].order_status === "cancelled") return loadData(generateMssg(text));
  if(orders[0] && orders[0].order_status !== "pending" && orders[0].payment_status !== "pending") return loadData(generateMssg(text));
  
  await updateOrder(orders[0].id, {order_status: "cancelled"})
  socket.emit('cancelOrder', orders[0].id);
})

// emit response to welcome message
const replyToWelcome = (option) => {
  socket.emit('replyToWelcome', option)
}

// emit response to invalid user input
const handleInvalidOption = () => {
  socket.emit('handleInvalidOption');
}


