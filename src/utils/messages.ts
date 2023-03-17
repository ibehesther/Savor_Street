import { MessageDTO } from "src/dto/message.dto";

export const welcomeMessage: MessageDTO =  {
    text: "Hello! Welcome to Savor Street Chatbot System.<br> <br>I'm SavorBot, your personal assistant. How can I help you today?",
    options: [
        // 'Type A to view our menu',
        'Select 1 to place an order',
        // 'Select 2 if you would like to receive recommendations from our \`sous chef\’',
        'Select 99 to checkout order',
        'Select 98 to see order history',
        'Select 97 to see current order',
        'Select 0 to cancel order'
    ],
    additional_text: `To make a selection, simply type the number that corresponds with your choice, as stated above. <br> <br>If you need help or want to return to this menu at any time, just type "menu" and I'll guide you back. <br> <br> Thank you for choosing Savor Street! We're here to make your experience as enjoyable as possible.
    `
}

export const invalidOptionMessage: MessageDTO = {
    text: 'You selected an invalid option. Please follow the menu instruction. <br><br> Type "menu" to go back to the main menu'
}
export function placeOrderMessage(order: any):MessageDTO {
    const {order_total, order_items, menu_items, pending, paid} = order;
    let options = []
    menu_items.map((item) => {
        let order_item = order_items.filter((itm)=>{
            return itm.item_id === item.id;
        });
        let qty = order_item[0].quantity;
        let mssg = `${qty} serving of ${item.name}: ${qty*item.price}`;
        options.push(mssg)
    })

    return {
        text: `Your ${pending? "pending" : ''} order:`,
        options,
        additional_text: `Total cost: ${order_total}. <br>
        ${pending && pending ? "Please type 'confirm' to confirm your order": ''}
        ${typeof pending === 'boolean' && pending !== true && paid ? '': "Select 99 to checkout order"}`
    }
   
}