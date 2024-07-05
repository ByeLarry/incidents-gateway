import {
  WebSocketGateway,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Socket } from 'net';
import { SocketService } from 'src/services/socket.service';
import { MsgMarksEnum } from 'src/utils/msg.marks.enum';
import { CoordsDto } from './dto/coords.dto';
import { transformToFeatureDto } from 'src/utils/transform-to-feature';
import { MarkRecvDto } from './dto/mark-recv.dto';

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

  @SubscribeMessage(MsgMarksEnum.MAP_INIT_SEND_CLIENT)
  mapInit(@ConnectedSocket() client: Socket, @MessageBody() data: CoordsDto) {
    try {
      this.socketService.sendMessage(MsgMarksEnum.MAP_INIT_SEND, data);
      this.socketService.on(
        MsgMarksEnum.MAP_INIT_RECV,
        (data: MarkRecvDto[]) => {
          return client.emit(
            MsgMarksEnum.MAP_INIT_RECV_CLIENT,
            transformToFeatureDto(data),
          );
        },
      );
    } catch (e) {
      console.log(e);
    }
  }
}
