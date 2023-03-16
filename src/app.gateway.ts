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
  private client: Socket;

  // @SubscribeMessage('welcome')
  // async handleWelcomeMessage(client: Socket, payload: any): Promise<void>    {
  //   this.client.emit('welcome', generateMessage(client, "Hello There"));
  // }

  @SubscribeMessage('handleInvalidOption')
  async handleInvalidOption(client: Socket, payload: any): Promise<void>{
    let default_response = generateMessage("SavorBot", invalidOptionMessage);
    this.client.emit('invalidOption', default_response);
  }

  @SubscribeMessage('handlePlaceOrder')
  async handlePlaceOrder(client: Socket, payload: any): Promise<void>{
    let order_mssg = generateMessage('SavorBot', placeOrderMessage(payload));
    this.client.emit('confirmOrder', order_mssg)
  }

  @SubscribeMessage('handleConfirmOrder')
  async handleConfirmOrder(client: Socket, payload: any): Promise<void>{
    let order_mssg = generateMessage('SavorBot', {text: "Your order is being processed ... <br> Select 99 to checkout"});
    this.client.emit('checkoutOrder', order_mssg)
  }

  @SubscribeMessage('handleOrderPayment')
  async handleOrderPayment(client: Socket, id: any): Promise<void> {
    let mssg = generateMessage('SavorBot', {text: `Congratulations! Your order with id ${id} has been checked out and ready for dispatch`});
    this.client.emit('payOrder', mssg)
  }

  @SubscribeMessage('cancelOrder')
  async handleDisplayOrders(client: Socket, id: any): Promise<void> {
    let welcome_mssg = generateMessage("SavorBot", welcomeMessage);
    let mssg = generateMessage('SavorBot', {text: `Your order with id ${id} has been cancelled`});
    this.client.emit('payOrder', mssg);
    this.client.emit('welcome', welcome_mssg);
  }

  @SubscribeMessage('replyToWelcome')
  async handleReplyToWelcome(client: Socket, payload: string): Promise<void>{
    let welcome_mssg = generateMessage("SavorBot", welcomeMessage);
    switch(payload){
      case('1'):
        this.client.emit('placeOrder');
        break;
      case('99'):
        this.client.emit("handleCheckOutOrder");
        break;
      case('98'):
        this.client.emit("handleFetchOrderHistory");
        break;  
      case('97'):
        this.client.emit('handleFetchCurrentOrder');
        break;
      case("0"):
        this.client.emit('handleCancelOrder')
        break;
      case('menu'):
        this.client.emit('welcome', welcome_mssg);
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
    this.client = client;
    console.log(`Connected ${client.id}`);
    let response =  generateMessage("SavorBot", welcomeMessage);
    this.server.emit('welcome', response);
  }
}