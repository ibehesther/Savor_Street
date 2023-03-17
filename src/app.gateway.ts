import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';

import { Socket, Server } from 'socket.io';
import { AppService } from './app.service';
import { generateMessage } from './utils/generate_mssg';
import { invalidOptionMessage, placeOrderMessage, welcomeMessage } from './utils/messages';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private appService: AppService) {}

  @WebSocketServer() server: Server;

  @SubscribeMessage('handleInvalidOption')
  async handleInvalidOption(client: Socket, payload: any): Promise<void>{
    let default_response = generateMessage("SavorBot", invalidOptionMessage);
    client.emit('invalidOption', default_response);
  }

  @SubscribeMessage('handlePlaceOrder')
  async handlePlaceOrder(client: Socket, payload: any): Promise<void>{
    let order_mssg = generateMessage('SavorBot', placeOrderMessage(payload));
    client.emit('confirmOrder', order_mssg)
  }

  @SubscribeMessage('handleConfirmOrder')
  async handleConfirmOrder(client: Socket, payload: any): Promise<void>{
    let order_mssg = generateMessage('SavorBot', {text: "Your order is being processed ... <br> Select 99 to checkout"});
    client.emit('checkoutOrder', order_mssg)
  }

  @SubscribeMessage('handleOrderPayment')
  async handleOrderPayment(client: Socket, id: any): Promise<void> {
    let mssg = generateMessage('SavorBot', {text: `Congratulations! Your order with id- ${id} has been checked out and ready for dispatch`});
    client.emit('payOrder', mssg)
  }

  @SubscribeMessage('cancelOrder')
  async handleDisplayOrders(client: Socket, id: any): Promise<void> {
    let welcome_mssg = generateMessage("SavorBot", welcomeMessage);
    let mssg = generateMessage('SavorBot', {text: `Your order with id ${id} has been cancelled`});
    client.emit('payOrder', mssg);
    client.emit('welcome', welcome_mssg);
  }

  @SubscribeMessage('replyToWelcome')
  async handleReplyToWelcome(client: Socket, payload: string): Promise<void>{
    let welcome_mssg = generateMessage("SavorBot", welcomeMessage);
    switch(payload){
      case('1'):
        client.emit('placeOrder');
        break;
      case('99'):
        client.emit("handleCheckOutOrder");
        break;
      case('98'):
        client.emit("handleFetchOrderHistory");
        break;  
      case('97'):
        client.emit('handleFetchCurrentOrder');
        break;
      case("0"):
        client.emit('handleCancelOrder')
        break;
      case('menu'):
        client.emit('welcome', welcome_mssg);
        break;
    }
  }
  
  afterInit(server: Server) {
    // console.log(server);
    
  }

  handleDisconnect(client: Socket) {
    console.log(`Disconnected: ${client.id}`);
  }

  async handleConnection(client: Socket, ...args: any[]) {
    console.log(`Connected ${client.id}`);
    let response =  generateMessage("SavorBot", welcomeMessage);
    client.emit('welcome', response);
  }
}