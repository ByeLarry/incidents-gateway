import {
  WebSocketGateway,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Socket } from 'net';
import { SocketService } from 'src/services/socket.service';
import { MsgMarksEnum } from 'src/utils/msg.marks.enum';

@WebSocketGateway({ cors: { origin: 'http://localhost' } })
export class MarksGateway {
  constructor(private readonly socketService: SocketService) {}

  @SubscribeMessage(MsgMarksEnum.TEST_SEND_CLIENT)
  test(@ConnectedSocket() client: Socket, @MessageBody() data: string) {
    try {
      this.socketService.sendMessage(MsgMarksEnum.TEST_SEND, data);
      this.socketService.on(MsgMarksEnum.TEST_RECV, (data) => {
        console.log(data);
        return client.emit(MsgMarksEnum.TEST_RECV_CLIENT, data);
      });
    } catch (e) {
      console.log(e);
    }
  }
}
