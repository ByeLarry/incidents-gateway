import { Controller, Get, Param } from '@nestjs/common';
import { SocketService } from 'src/services/socket.service';
import { MsgMarksEnum } from 'src/utils/msg.marks.enum';
import { MarkRecvDto } from './dto/mark-recv.dto';

@Controller('api/mark')
export class MarkController {
  constructor(private readonly socketService: SocketService) {}

  @Get(':id')
  async getMark(@Param('id') id: string): Promise<MarkRecvDto> {
    try {
      this.socketService.sendMessage(MsgMarksEnum.MARK_GET_SEND, id);
      return new Promise((resolve, reject) => {
        this.socketService.on(
          MsgMarksEnum.MARK_GET_RECV,
          (data: MarkRecvDto) => {
            console.log(data);
            this.socketService.off(MsgMarksEnum.MARK_GET_RECV);
            resolve(data);
          },
        );
        setTimeout(() => {
          reject(new Error('Request timed out'));
        }, 5000);
      });
    } catch (e) {
      console.log(e);
    }
  }
}
