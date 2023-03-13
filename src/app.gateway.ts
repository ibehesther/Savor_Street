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
    let welcome_mssg = generateMessage("SavorBot", welcomeMessage);
    let default_response = generateMessage("SavorBot", invalidOptionMessage);
    this.client.emit('invalidOption', default_response);
    this.client.emit('welcome', welcome_mssg);
  }

  @SubscribeMessage('handlePlaceOrder')
  async handlePlaceOrder(client: Socket, payload: any): Promise<void>{
    let order_mssg = generateMessage('SavorBot', placeOrderMessage(payload));
    console.log(order_mssg);
    this.client.emit('confirmOrder', order_mssg)
  }

  @SubscribeMessage('replyToWelcome')
  async handleReplyToWelcome(client: Socket, payload: string): Promise<void>{
    let welcome_mssg = generateMessage("SavorBot", welcomeMessage);
    switch(payload){
      case('1'):
        this.client.emit('placeOrder');
        break;
      case('99'):
        this.client.emit("CheckOutOrder", "Checking out order...");
        break;
      case('98'):
        this.client.emit("fetchOrderHistory", 'Fetching Order History...');
        break;  
      case('97'):
        this.client.emit('fetchCurrentOrder', "Fetching current order...");
        break;
      case("0"):
        this.client.emit('cancelOrder', "Canceling Order...");
        break;
      case('menu'):
        this.client.emit('welcome', welcome_mssg);
        break;
    }
    // this.client.emit('replyToWelcome')
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