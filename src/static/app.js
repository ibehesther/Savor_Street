`use-strict`
const URL='http://127.0.0.1:3000';
const socket = io(URL);
const msgCont = document.getElementById('data-container');
const userForm = document.getElementById('user_form');
const userInput = document.getElementById('user_input');
 
//get old messages from the server
const messages = [];
// function getMessages() {
//  fetch('http://localhost:3000/api/chat')
//    .then((response) => response.json())
//    .then((data) => {
//      loadDate(data);
//      data.forEach((el) => {
//        messages.push(el);
//      });
//    })
//    .catch((err) => console.error(err));
// }
// getMessages();
 
// Get user 
const getUser = async() => {
  let user_id = localStorage.getItem('user_id');
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

let getMenuItem = async(id) => {
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
    console.log(data)
    return data
  })
  .catch(console.log);
  return user_orders;
}
const getOrderDetails = async(order, items) => {
  let total = 0;
  let s_order_items = [];
  let s_menu_items = [];
  let menu = await getMenu();

  let { order_total, order_items, menu_items} = await getTotal(items, menu, order, s_order_items, s_menu_items, total);
  await updateOrder(order.id, {total_order_amount: order_total});
  return {order_total, order_items, menu_items}
}
const createOrder = async() => {
  // let total = 0;
  // let s_order_items = [];
  // let s_menu_items = []
  let user_id = localStorage.getItem('user_id');
  // let menu = await getMenu();
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
  // let { order_total, order_items, menu_items} = await getTotal(items, menu, order, s_order_items, s_menu_items, total);
  // await updateOrder(order.id, {total_order_amount: order_total});
  // return {order_total, order_items, menu_items}
}

const updateOrder = async(id, body) => {
  let order = await fetch(`${URL}/api/orders/${id}`,{
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

const getTotal = async(items, menu, order, s_order_items,s_menu_items , total) => {
  let i =0;
  for(let item in items){
    let id = item.replace('m', '')
    id = parseInt(menu[id].id)
    let menu_item = await getMenuItem(id);
    let order_item = await createOrderItem(menu_item, order, items[item])
    total += menu_item.price
    s_order_items.push(order_item);
    s_menu_items.push(menu_item);

    if(i === Object.keys(items).length - 1){
      console.log({total, order_items: s_order_items})
      return {order_total :total, order_items: s_order_items, menu_items : s_menu_items};
    }
    i++;
  }
 
}

const handlePlaceOrder = async(input) => {
  const user_orders = await getUserOrders()
  console.log(user_orders)
  if( user_orders[0] && user_orders[0].order_status === 'pending'){
    console.log(getOrderDetails(user_orders[0]))
  }
  let items = input.split(',');
  let item_qty = {};

  items.map((item) => {
    let item_arr = item.split('-');
    item_qty[item_arr[0].trim()] = item_arr[1] && item_arr[1].trim()*1 || 1
  });
  let order = await createOrder();

  console.log(order)
  let order_details = getOrderDetails(order, item_qty)
  console.log(order_details);
  socket.emit('handlePlaceOrder', order_details);
}

// When a user press the enter key, send message.
userForm.addEventListener('submit', async(e) => {
  e.preventDefault();
  let input = userInput.value.toLowerCase();
  switch(input){
    case('1' || '99' || '98' || '97' || '0'):
      replyToWelcome(input);
      break;
    case('menu'):
      replyToWelcome(input);
      break;
    case input.match(/^m\d+/)?.input:
      handlePlaceOrder(input)
      break;
    default:
      handleInvalidOption();
  }

  // Reset Input field
  userInput.value= '';
});
 
//Display messages to the users
function loadData(data) {
  let messages = `<div>`
  messages += `<em>${data.user}</em> \n`;

  let message = data.obj;
  messages += `<p>${message.text}<p>`;
  messages += `<ul>`;
  message.options && message.options.map((option) => {
    messages += `<li class=""> ${option} </li>`;
  })
  messages += `</ul>`;
  messages += `<p>${message.additional_text ? message.additional_text : ''}</p> <span class="fw-bolder">${data.createdAt}</span>`;
  messages += '</div>';

  msgCont.innerHTML += messages;
}

const loadMenu = (menu) => {
  let messages = `
  <div>
    <table>
      <tr> 
        <th> Code </th>
        <th> Name </th>
        <th> Description </th>
        <th> Price &#8358; </th>
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
  <p> 
    Please select the code that matches the item you would like to order
    and the quantity seperated by a dash.<br>
    For example: To place an order for 2 serving of ${menu[0].name}, you type "m1-2". <br>
    To place an order for more than one item, seperate each order item with a comma in the same format above. <br>
    For example: "m1-2,m3-1"
  </p>
  </div>
  `
  msgCont.innerHTML += messages;
}
 
//socket.io
//emit sendMessage event to send message
// function sendMessage(message) {
//  socket.emit('sendMessage', message);
// }
//Listen to recMessage event to get the messages sent by users
// socket.on('recMessage', (message) => {
//  messages.push(message);
//  loadDate(messages);
// })
socket.on('welcome', (message) => {
  let user = getUser();
  loadData(message);
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

// emit response to welcome message
const replyToWelcome = (option) => {
  socket.emit('replyToWelcome', option)
}

// emit response to invalid user input
const handleInvalidOption = () => {
  socket.emit('handleInvalidOption');
}


