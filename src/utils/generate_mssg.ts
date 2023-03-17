import moment from 'moment';
import { MessageDTO } from 'src/dto/message.dto';

export const generateMessage = (user: string, obj: MessageDTO) => {
    return {
        user,
        obj,
        createdAt: moment(new Date().toISOString()).format("HH:mm")
    }
}